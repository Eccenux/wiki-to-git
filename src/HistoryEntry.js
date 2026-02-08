/**
 * History entry for git.
 */
export default class HistoryEntry {
	/**
	 * Init from MW history.
	 * @param {Object} revision Object from REST history API.
	 */
	constructor(revision) {
		/** @type {String} */
		this.dt = String(revision?.timestamp ?? '');
		/** @type {String} */
		this.author = String(revision?.user?.name ?? '');
		/** @type {Number} */
		this.id = Number(revision?.id ?? 0);
		/** @type {String} */
		this.message = String(revision?.comment ?? '');
	}

	static recreate(entry) {
		let me = new HistoryEntry({});

		me.dt = String(entry.dt ?? '');
		me.author = String(entry.author ?? '');
		me.id = Number(entry.id ?? 0);
		me.message = String(entry.message ?? '');

		return me;
	}
}
