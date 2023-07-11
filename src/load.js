import { LoadData } from './LoadData.js';

/**
 * Download page history from a Mediawiki site.
 */
const site = 'en.wikipedia.org';
const page = 'Agapanthus';
const loader = new LoadData(site);
// await loader.load(page);
// await loader.saveHistory();
// loader.info();

// read from JSON
loader.history = [];
await loader.readHistory();
loader.info();

// test rev save
await loader.poc();
