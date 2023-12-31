#!/usr/bin/env node

/**
 * Download page history from a MediaWiki site.
 */
import { Command } from 'commander';
import { runScript } from './cmd-load.js';

const program = new Command();

program
	.description('Download page history from a MediaWiki site. Loads metadata from a wiki site and save this to a history json.')
	.requiredOption('-s, --site <site>', `MediaWiki site domain (e.g. 'en.wikipedia.org').`)
	.requiredOption('-p, --page <page>', 'Page to download (title with namespace).')
	.option('-j, --json <fileName>', `Optional JSON file name for history data (default: 'history.json').`)
	.option('-l, --limit <number>', `Optional limit of revisions to download from top (default: no limit).`)
	.parse(process.argv);

const options = program.opts();

let { site, page, json, limit } = options;

if (typeof json != 'string') {
	json = '';
}

// console.log('temp', { site, page, json });

await runScript(site, page, json, limit);