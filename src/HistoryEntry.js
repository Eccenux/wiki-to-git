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
		this.dt = revision.timestamp;
		/** @type {String} */
		this.author = revision.user.name;
		/** @type {Number} */
		this.id = revision.id;
		/** @type {String} */
		this.message = revision.comment;
	}
}
