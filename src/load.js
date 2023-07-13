/* eslint-disable no-unused-vars */
import GitOps from './GitOps.js';
import { LoadData } from './LoadData.js';

/**
 * Download page history from a Mediawiki site.
 */
const site = 'pl.wikipedia.org';
const page = 'MediaWiki:Gadget-gConfig.js';
const loader = new LoadData(site);
console.log('\n\nDownload history for %s.', page);
// await loader.load(page);
// await loader.saveHistory();
// loader.info();

/**
 * Read page history from JSON.
 */
loader.history = [];
await loader.readHistory();
loader.info();

// test rev save
// await loader.poc();

/**
 * Create Git repo.
 */
const repoName = 'wiki-gConfig-test';
const filename = 'gConfig.js';
console.log('\n\nCreating Git repo (%s).', repoName);
loader.repoCreate(repoName);
console.log('\nSave history as %s.', filename);
loader.repoCommit(repoName, filename);
