import HistoryEntry from './HistoryEntry.js';

/**
 * Git operations helper.
 */
export default class GitOps {
	constructor(baseDir, repoName) {
		/** Base, output directory. */
		this.baseDir = baseDir;
		/** Base, output directory. */
		this.repoName = repoName;
	}

	/** Create repo. */
	create() {
	}

	/** Add all files (stage changes). */
	addAll() {
	}

	/**
	 * Commit staged changes.
	 * @param {HistoryEntry} history 
	 */
	commit(history) {
	}
}