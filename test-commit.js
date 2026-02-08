/* eslint-disable no-constant-condition */

/*
	Test script doing load & commit.

	Effectively the same as running:
	npx wiki2git-load   --site pl.wikipedia.org -p "Wikipedysta:Nux/common.js" -j history-common.priv.json -l 10
	npx wiki2git-commit --site pl.wikipedia.org --repo "../wiki-to---test/test-repo" -j history-common.priv.json -o "common.js"
*/

import fs from 'fs';
import path from 'path';

import { runScript as runDownload } from './src/cmd-load.js';
import { runScript as runCommit } from './src/cmd-commit.js';

let options = {
	site: 'pl.wikipedia.org',
	page: 'Wikipedysta:Nux/common.js',
	json: 'history-common.priv.json',
	limit: '10',

	repo: "../wiki-to---test/test-repo",
	output: 'common.js',
};

// npx wiki2git-load
if (1) {
	let { site, page, json, limit } = options;
	await runDownload(site, page, json, limit);
}
// npx wiki2git-commit
if (1) {
	let { site, repo, output, json } = options;
	
	// re-create dir
	let repoPath = path.resolve(repo);
	if (fs.existsSync(repoPath)) {
		fs.rmSync(repoPath, { recursive: true, force: true });
	}
	fs.mkdirSync(repoPath, { recursive: true });

	await runCommit(site, repo, output, json);
	
}