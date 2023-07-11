import fetch from 'node-fetch';
import fs from 'fs';
import fsa from 'fs/promises';

/**
 * Download page history from a Mediawiki site.
 */
class LoadData {
	/**
	 * Init.
	 * @param {String} site Domain of the Wiki. 
	 * @param {String} page Page/Article (with namespace).
	 */
	constructor(site, page) {
		/** Initial URL. */
		this.url = `https://${site}/w/rest.php/v1/page/${page}/history`;		;
		/** Page history. */
		this.history = [];
	}

	/**
	 * Load history entries.
	 */
	async load() {
		let url = this.url;
		do {
			const response = await fetch(url);
			url = await this.loadPage(response);
		} while (url)
		await this.poc();
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

		console.log(data.revisions.length, data.older);
		for (const revision of data.revisions) {
			const entry = {
				dt: revision.timestamp,
				author: revision.user.name,
				id: revision.id,
				message: revision.comment,
			};
			this.history.push(entry);
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
		let url = `https://${site}/w/rest.php/v1/revision/${id}`;
		const response = await fetch(url);
		const data = await response.json();

		console.log(data.timestamp, data.page.title, data.user.name);

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
		// const data = await fsa.readFile(srcJs, 'utf8');
		const data = await this.loadRev(id);
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
		const dir = 'repo/';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		await Promise.all([
			this.saveRev(first.id, dir + '1st.tex'),
			this.saveRev(last.id, dir + 'last.tex'),
		]);
	}
}

const site = 'en.wikipedia.org';
const page = 'Agapanthus';
const loader = new LoadData(site, page);
await loader.load();
loader.info();
