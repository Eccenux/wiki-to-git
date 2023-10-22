/**
 * Download page history from a MediaWiki site.
 */
import { LoadData } from './LoadData.js';

/**
 * Download page history from a MediaWiki site.
 */
export async function runScript(site, page, historyFile, limit) {
	const loader = new LoadData(site);
	loader.baseDir = './';

	let options = {
		changes: -1, 	// no. changes (default - no limit)
	};
	if (limit) {
		let changes = parseInt(limit, 10);
		if (changes && changes > 0) {
			options.changes = changes;
		}
	}

	console.log('\n\nDownload history for %s.', page);
	// this will load version history into internals
	await loader.load(page, options);
	// this will save history as JSON
	await loader.saveHistory(historyFile, true);
	// this just shows a quick info (you can skip this)
	loader.info();
}

const test = 0;
// const test = 1;
if (test) {
	const { site, page, historyFile } = {
		site: 'meta.wikimedia.org',
		page: 'User:Nux/global.js',
		historyFile: 'repo/h-global.json',
	}
	await runScript(site, page, historyFile);
}
