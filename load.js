import fetch from 'node-fetch';

/**
 * Download page history from a Mediawiki site.
 */
class LoadData {
	constructor(url) {
		/** Initial URL. */
		this.url = url;
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
	 * @param {Response} response Page result.
	 * @returns Next URL.
	 */
	async loadPage(response) {
		const data = await response.json();

		console.log(data.revisions.length, data.older);
		for (const revision of data.revisions) {
			const entry = {
				dt: revision.timestamp,
				message: revision.comment,
				author: revision.user.name
			};
			this.history.push(entry);
			console.log(entry);
		}

		return data.older;
	}
}

const url = 'https://en.wikipedia.org/w/rest.php/v1/page/Agapanthus/history';
const loader = new LoadData(url);
await loader.load();
loader.info();
