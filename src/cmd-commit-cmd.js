#!/usr/bin/env node

/**
 * Commit history JSON to a new git file.
 */
import { Command } from 'commander';
import { CmdHelper } from './CmdHelper.js';
import { runScript } from './cmd-commit.js';

const program = new Command('wiki2git-commit');

const helper = new CmdHelper({
	requiredOptions: ['site', 'repo', 'output'],
	program,
});

program
	.usage('-s <site> -r <repo dir name> -o <dst file name> [-j <history json>]')
	.description(`Commit JSON to Git.
		
		Creates a file in the Git repository (specified by *repo dir name*).
		The output file will have a complete Git history as it had on Wikipedia
		(the history is commited based on the history in the JSON file).

		Examples of valid syntax:
		wiki2git-commit --site meta.wikimedia.org --repo "legacy-repo" -o "monobook.js"
		wiki2git-commit --site meta.wikimedia.org --repo "global-JS-CSS" -o "global.js" -j "history-js.json"
		wiki2git-commit --site meta.wikimedia.org --repo "global-JS-CSS" -o "global.css" -j "history-css.json"

		Required options: ${helper.requiredOptions.join(', ')}.
	`.replaceAll(/\n\t{2}/g, '\n').trim())
	.option('-s, --site <site>', `MediaWiki site domain (e.g. 'en.wikipedia.org').`)
	.option('-r, --repo <dirName>', 'Git repository name (new or existing subdirectory).')
	.option('-o, --output <fileName>', 'Output file name (new JS/CSS file in the git repo).')
	.option('-j, --json <fileName>', `Optional JSON file name for history data (default: 'history.json').`)
	.parse(process.argv);

const options = program.opts();

let { site, repo, output, json } = options;

// required
helper.check(options);
// default
if (typeof json != 'string') {
	json = '';
}


await runScript(site, repo, output, json);
