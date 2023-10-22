/**
 * Commit history JSON to git.
 */
import { LoadData } from './LoadData.js';

/**
 * Commit history JSON to a new git file.
 * @param {String} repoName E.g. 'wiki-exampleGadgetScript'.
 * @param {String} filename E.g. 'exampleGadgetScript.js'.
 * @param {String} historyFile (optional) JSON file name (default: 'history.json').
 */
export async function runScript(site, repoName, filename, historyFile = '') {
	const loader = new LoadData(site);
	loader.baseDir = './';

	/**
	 * Read page history from JSON.
	 */
	loader.history = [];
	await loader.readHistory(historyFile);
	loader.info();

	/**
	 * Create Git repo.
	 */
	console.log('\n\nCreating Git repo (%s).', repoName);
	loader.repoCreate(repoName);
	console.log('\nSave history as %s.', filename);
	loader.repoCommit(repoName, filename);
}

const test = 0;
// const test = 1;
if (test) {
	const { site, repo, filename, historyFile } = {
		site: 'meta.wikimedia.org',
		repo: 'repo/wiki-global-test',
		filename: 'global.js',
		historyFile: 'repo/h-global.json',
	}
	await runScript(site, repo, filename, historyFile);
}
