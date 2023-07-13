import fetch from 'node-fetch';
import fs from 'fs';
import fsa from 'fs/promises';
import HistoryEntry from './HistoryEntry.js';
import GitOps from './GitOps.js';

/**
 * Download page history from a Mediawiki site.
 */
export class LoadData {
	/**
	 * Init.
	 * @param {String} site Domain of the Wiki. 
	 */
	constructor(site) {
		/** Base, output directory. */
		this.baseDir = 'repo/';
		/** History file. */
		this.historyFile = 'history.json';
		/** Initial URL. */
		this.origin = `https://${site}`;		;
		/**
		 * Page history.
		 * @type {HistoryEntry[]}
		 */
		this.history = [];
		/** Debug mode. */
		this.debug = false;
	}

	/**
	 * Load history entries.
     * 
	 * @param {String} page Page/Article (with namespace).
	 * @param {Object} userOptions Limits.
	 */
	async load(page, userOptions) {
		let options = {
			pages: -1,	// no. pages (default - no limit) 
			changes: -1, 	// no. changes (default - no limit)
		};
		Object.assign(options, userOptions);
		
		let url = `${this.origin}/w/rest.php/v1/page/${encodeURIComponent(page)}/history`;
		let count = 0;
		do {
			const response = await fetch(url);
			url = await this.loadPage(response);

			// page limit
			if (options.pages > 0) {
				count++;
				if (count >= options.pages) {
					break;
				}
			}
			// changes limit
			if (options.changes > 0) {
				if (this.history.length >= options.changes) {
					break;
				}
			}
		} while (url)
	}

	/** History info. */
	info() {
		console.log('Data loaded:', this.history.length);
		const first = this.history[this.history.length - 1];
		const last = this.history[0];
		console.log('First edit:', first);
		console.log('Last edit:', last);
	}

	/**
	 * Load page.
	 * @private
	 * 
	 * Typically the page would have 20 entries.
	 * 
	 * Example start url:
	 * https://en.wikipedia.org/w/rest.php/v1/page/Agapanthus/history
	 * 
	 * @param {Response} response Page result.
	 * @returns Next URL.
	 */
	async loadPage(response) {
		const data = await response.json();

		// empty
		if (!data?.revisions?.length) {
			console.warn('no data', data);
			return false;
		}

		if (this.debug)
			console.log(data.revisions.length, data.older);

		for (const revision of data?.revisions) {
			const entry = new HistoryEntry(revision);
			this.history.push(entry);
			if (this.debug)
				console.log(entry);
		}

		return data.older;
	}

	/**
	 * Load full revision data.
	 * @private
	 * 
	 * Example url:
	 * https://en.wikipedia.org/w/rest.php/v1/revision/764138197
	 * 
	 * @param {Number} id Revision ID.
	 * @returns Revision data.
	 */
	async loadRev(id) {
		let url = `${this.origin}/w/rest.php/v1/revision/${id}`;
		const response = await fetch(url);
		const data = await response.json();

		if (this.debug)
			console.log('loadRev: ', data.timestamp, data.page.title, data.user.name);

		return data.source;
	}

	/**
	 * Load and save revision as a file.
	 * @private
	 * 
	 * @param {Number} id Revision ID.
	 * @param {String} dstFile Destionation path.
	 * @returns Revision data.
	 */
	async saveRev(id, dstFile) {
		const data = await this.loadRev(id);
		if (this.debug)
			console.log('saveRev (%d): %s', data?.length || 0, dstFile);
		await fsa.writeFile(dstFile, data);
		return data;
	}

	/**
	 * PoC: load content.
	 * 
	 * TODO: Later probably load rev, save and commit.
	 * Maybe do separately from loading history 
	 * to allow creating history JSON in different ways later...
	 * Someone might want to merge history of two pages I guess...
	 */
	async poc() {
		const first = this.history[this.history.length - 1];
		const last = this.history[0];
		const dir = this.baseDir;
		this.prepareDir();
		await Promise.all([
			this.saveRev(first.id, dir + '1st.tex'),
			this.saveRev(last.id, dir + 'last.tex'),
		]);
	}

	/**
	 * Init repo.
	 * 
	 * Skip this if repo already exists 
	 * and you are just creating a history of a new file.
	 */
	async repoCreate(repoName) {
		if (!this.history.length) {
			throw 'Load (or read) history first';
		}
		this.prepareDir();
		const git = new GitOps(this.baseDir, repoName);
		await git.create();
	}

	/** @private Sort history from oldest. */
	sortHistory() {
		this.history.sort((a, b) => {
			let d_a = new Date(a.dt);
			let d_b = new Date(b.dt);
			return d_a.getTime() - d_b.getTime();
		});
	}

	/**
	 * Commit file history into the repo.
	 * 
	 * Load rev, save and commit.
	 * This is separate from loading historyon purpose.
	 * Use `saveHistory` after initial load and then `readHistory`.
	 * You can manipulatedsaved JSON in between or merge two files as one.
	 */
	async repoCommit(repoName, filename) {
		if (!this.history.length) {
			throw 'Load (or read) history first';
		}
		const git = new GitOps(this.baseDir, repoName);

		const dir = this.baseDir + repoName + '/';
		this.sortHistory();
		for (const history of this.history) {
			// console.log(history.dt);
			await this.saveRev(history.id, dir + filename);
			await git.addAll();
			await git.commit(history);
		}
	}

	/**
	 * Preare base directory.
	 * @private
	 */
	prepareDir() {
		const dir = this.baseDir;
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	}

	/**
	 * Save history as a file.
	 */
	async saveHistory() {
		this.prepareDir();
		const dir = this.baseDir;
		const dstFile = dir + this.historyFile;
		const data = JSON.stringify(this.history, null, '\t');
		await fsa.writeFile(dstFile, data);
		return data;
	}

    /**
	 * Read history from a file.
	 */
	async readHistory() {
		const dir = this.baseDir;
		const file = dir + this.historyFile;
		const raw = await fsa.readFile(file, 'utf8');
		this.history = JSON.parse(raw);
		return this.history;
	}
}
