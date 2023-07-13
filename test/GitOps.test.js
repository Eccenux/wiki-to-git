/* global describe, it */
import { assert } from 'chai';
import GitOps from '../src/GitOps.js';

describe('GitOps', function () {
	
	describe('pAuthor', function () {
		const git = new GitOps('./repo', 'test-repo');
		let fakeDomain = 'fake.example.com';
		git.fakeDomain = fakeDomain;
		function createEntry(author) {
			const history = {dt: '2012-11-02T14:09:30Z', author: author, id: 123, message: 'v1.2.3'};
			return history;
		}

		it('should add fake e-mail', function () {
			let user = `Nux`;
			let history = createEntry(user);
			let result = git.pAuthor(history);
			let expected = `--author="${user} <${user}@${fakeDomain}>"`;
			assert.equal(result, expected);

			user = `Johnny`;
			history = createEntry(user);
			result = git.pAuthor(history);
			expected = `--author="${user} <${user}@${fakeDomain}>"`;
			assert.equal(result, expected);
		});
		it('should handle whitespace', function () {
			let user = `Some Author Name`;
			let history = createEntry(user);
			let result = git.pAuthor(history);
			let expected = `--author="${user} <Some-Author-Name@${fakeDomain}>"`;
			assert.equal(result, expected);
		});
		it('should remove special', function () {
			let expected = `--author="Some Name <Some-Name@${fakeDomain}>"`;
			let variants = [
				`Some'Name`,
				`Some@Name`,
				`Some"Name`,
				`Some<Name`,
				`Some>Name`,
				`Some+Name`,
			];
			for (const user of variants) {
				let history = createEntry(user);
				let result = git.pAuthor(history);
				assert.equal(result, expected);
			}
		});
	});

	describe('pDate', function () {
		const git = new GitOps('./repo', 'test-repo');
		function createEntry(dt) {
			const history = {dt: dt, author: 'Johnny', id: 123, message: 'v1.2.3'};
			return history;
		}

		it('should format param', function () {
			let dt = '2023-01-22T19:52:05Z';
			let history = createEntry(dt);
			let result = git.pDate(history);
			let expected = `--date='${dt}'`;
			assert.equal(result, expected);
		});
	});
});
// assert.isTrue(loader.history.length > 50);
