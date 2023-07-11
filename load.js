import fetch from 'node-fetch';

/**
 * Download page history from a Mediawiki site.
 */
class LoadData {
	constructor(url) {
		this.url = url;
	}

	async load() {
		const response = await fetch(this.url);
		this.loadPage(response);
	}

	async loadPage(response) {
		const data = await response.json();

		console.log(data.revisions.length, data.older);
		for (const revision of data.revisions) {
			console.log({
				dt: revision.timestamp,
				message: revision.comment,
				author: revision.user.name
			})
		}
	}
}

const url = 'https://en.wikipedia.org/w/rest.php/v1/page/Agapanthus/history';
const loader = new LoadData(url);
loader.load();