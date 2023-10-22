#!/usr/bin/env node

/**
 * Commit history JSON to a new git file.
 */
import { Command } from 'commander';
import { runScript } from './cmd-load.js';

const program = new Command();

program
	.description('Commit JSON to Git. Creates a file in the Git repo. The output file will have a complete Git history as it had on Wikipedia.')
	.requiredOption('-s, --site <site>', `MediaWiki site domain (e.g. 'en.wikipedia.org').`)
	.requiredOption('-r, --repo <dirName>', 'Git repository name (new or existing subdirectory).')
	.requiredOption('-o, --output <fileName>', 'Output file name (new JS/CSS file in the git repo).')
	.option('-j, --json <fileName>', `Optional JSON file name for history data (default: 'history.json').`, '')
	.parse(process.argv);

const options = program.opts();

const { site, repo, output, json } = options;

await runScript(site, repo, output, json);
