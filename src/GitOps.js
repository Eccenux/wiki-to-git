import HistoryEntry from './HistoryEntry.js';
import util from 'util';
import { exec as execClassic } from 'child_process';
const exec = util.promisify(execClassic);

/**
 * Git operations helper.
 */
export default class GitOps {
	constructor(baseDir, repoName) {
		/** Base, output directory. */
		this.baseDir = baseDir;
		/** Repository directory. */
		this.repoName = repoName;
	}

	/** Create repo. */
	async create() {
		const result = await this.exec(`git init ${this.baseDir}/${this.repoName}`);
		if (!result) {
			throw 'Unable to create repo!';
		}
		return result;
	}

	/** Add all files (stage changes). */
	async addAll() {
	}

	/**
	 * Commit staged changes.
	 * @param {HistoryEntry} history 
	 */
	async commit(history) {
	}

	/** @private Execute and report problems. */
	async exec(cmd) {
		const { stdout, stderr } = await exec(cmd);
		if (stdout && stdout.length) {
			console.log(stdout);
		}
		if (stderr && stderr.length) {
			console.warn(stderr);
			return false;
		}
		return true;
	}
}