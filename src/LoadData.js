import fetch from 'node-fetch';
import fs from 'fs';
import fsa from 'fs/promises';

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
		/** Page history. */
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
			const entry = {
				dt: revision.timestamp,
				author: revision.user.name,
				id: revision.id,
				message: revision.comment,
			};
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