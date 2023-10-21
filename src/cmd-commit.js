/**
 * Commit history JSON to git.
 */
import { LoadData } from './LoadData.js';

//
// Config.
// change this values to your needs
const repoName = 'wiki-exampleGadgetScript';
const filename = 'exampleGadgetScript.js';
// optional JSON file name (default: 'history.json')
const historyFile = '';

const loader = new LoadData();

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
