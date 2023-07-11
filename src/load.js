import { LoadData } from './LoadData.js';

/**
 * Download page history from a Mediawiki site.
 */
const site = 'en.wikipedia.org';
const page = 'Agapanthus';
const loader = new LoadData(site, page);
await loader.load();
loader.info();
