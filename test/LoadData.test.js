/* global describe, it */
import { assert } from 'chai';
import { LoadData } from '../src/LoadData.js';

describe('LoadData', function () {
	
	describe('load', function () {
		it('should read full history', async function () {
			// ~63 changes
			// https://pl.wikipedia.org/w/index.php?title=Wikipedysta:Nux/legacy/vector.css&action=history&offset=&limit=60
			const site = 'pl.wikipedia.org';
			const loader = new LoadData(site);
			await loader.load('Wikipedysta:Nux/legacy/vector.css');
			loader.info();
			assert.equal(typeof loader.history, 'object');
			assert.isTrue(loader.history.length > 50);
		});
		it('should read 1st page', async function () {
			// ~63 changes
			// https://pl.wikipedia.org/w/index.php?title=Wikipedysta:Nux/legacy/vector.css&action=history&offset=&limit=60
			const site = 'pl.wikipedia.org';
			const loader = new LoadData(site);
			await loader.load('Wikipedysta:Nux/legacy/vector.css', {
				pages: 1,
			});
			loader.info();
			assert.equal(typeof loader.history, 'object');
			assert.isTrue(loader.history.length < 40);
		});
		it('should read less changes', async function () {
			// ~63 changes
			// https://pl.wikipedia.org/w/index.php?title=Wikipedysta:Nux/legacy/vector.css&action=history&offset=&limit=60
			const site = 'pl.wikipedia.org';
			const loader = new LoadData(site);
			const limit = 22;
			await loader.load('Wikipedysta:Nux/legacy/vector.css', {
				changes: limit,
			});
			loader.info();
			assert.equal(typeof loader.history, 'object');
			assert.isTrue(loader.history.length >= limit);
			assert.isTrue(loader.history.length < 50);
		});
	});
});
