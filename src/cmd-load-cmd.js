#!/usr/bin/env node

/**
 * Download page history from a MediaWiki site.
 */
import { Command } from 'commander';
import { CmdHelper } from './CmdHelper.js';
import { runScript } from './cmd-load.js';

const program = new Command('wiki2git-load');

const helper = new CmdHelper({
	requiredOptions: ['site', 'page'],
	program,
});

program
	.usage('-s <site> -p <page> [options]')
	.description(`Download page history from a MediaWiki site.

		Loads metadata from a wiki site and save this to a history json.

		Examples of valid syntax:
		wiki2git-load -s en.wikipedia.org -p "User:Nux/monobook.js"
		wiki2git-load -s "en.wikipedia.org" -p "User:Nux/monobook.js"
		wiki2git-load --site en.wikipedia.org --p "User:Nux/monobook.js"
		wiki2git-load --site en.wikipedia.org --page "User:Nux/monobook.js"

		Required options: ${helper.requiredOptions.join(', ')}.
	`.replaceAll(/\n\t{2}/g, '\n').trim())
	.option('-s, --site <site>', `MediaWiki site domain (e.g. 'en.wikipedia.org').`)
	.option('-p, --page <page>', 'Page to download (title with namespace).')
	.option('-j, --json <fileName>', `Optional JSON file name for history data (default: 'history.json').`)
	.option('-l, --limit <number>', `Optional limit of revisions to download from top (default: no limit).`)
	.parse(process.argv);

const options = program.opts();

let { site, page, json, limit } = options;

// required
helper.check(options);
// default
if (typeof json != 'string') {
	json = '';
}


await runScript(site, page, json, limit);