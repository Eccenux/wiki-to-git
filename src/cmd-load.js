/**
 * Download page history from a MediaWiki site.
 */
import { LoadData } from './LoadData.js';

//
// Config.
// change this values to your needs
const site = 'en.wikipedia.org';
const page = 'MediaWiki:Gadget-exampleGadgetScript.js';
// optional JSON file name (default: 'history.json')
const historyFile = '';

const loader = new LoadData(site);

/**
 * Download page history from a MediaWiki site.
 */
console.log('\n\nDownload history for %s.', page);
// this will load version history into internals
await loader.load(page);
// this will save history as JSON
await loader.saveHistory(historyFile);
// this just shows a quick info (you can skip this)
loader.info();
