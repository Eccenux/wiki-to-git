import HistoryEntry from './HistoryEntry.js';
import util from 'util';
import { exec as execClassic, execFile as execFileC } from 'child_process';
const exec = util.promisify(execClassic);
const execFile = util.promisify(execFileC);

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

	set baseDir(dir) {
		// only allows strings
		if (typeof dir === 'string') {
			// remove trailing slash
			if (dir.search(/\/$/) > 0) {
				dir = dir.replace(/\/+$/, '');
			}
			this._baseDir = dir;
		}
	}
	/** @returns {String} Base, output directory. */
	get baseDir() {
		return this._baseDir;
	}

	/** @returns {String} Repo directory. */
	get dir() {
		return `${this.baseDir}/${this.repoName}`;
	}

	/** Create repo. */
	async create() {
		const result = await this.exec(`git init ${this.repoName}`, this.baseDir);
		if (!result) {
			throw 'Unable to create repo!';
		}
		return result;
	}

	/** Add all files (stage changes). */
	async addAll() {
		const result = await this.exec(`git add -A`, this.dir);
		if (!result) {
			console.warn('Some problems when staging...');
		}
		return result;
	}

	/**
	 * Commit staged changes.
	 * @param {HistoryEntry} history 
	 */
	async commit(history) {
		// git commit -m "Description from history" --author="Matma Rex <Matma-Rex@fake.wikipedia.org>"
		// --date=<date> 
		const args = ['commit'];
		args.push('-m'); args.push(history.message);
		args.push('--author='); args.push(history.author);
		args.push('--date='); args.push(history.dt);
		const result = await this.execFile('git', args, this.dir);
		if (!result) {
			throw 'Unable to commit changes!';
		}
		return result;
	}

	/** @private Execute and report problems (unsafe!). */
	async exec(cmd, dir) {
		const { stdout, stderr } = await exec(cmd, {cwd: dir});
		return this.execInfo(stdout, stderr);
	}

	/** @private Report exec problems. */
	async execInfo(stdout, stderr) {
		if (stdout && stdout.length) {
			console.log(stdout);
		}
		if (stderr && stderr.length) {
			console.warn(stderr);
			return false;
		}
		return true;
	}

	/** @private Execute and report problems. */
	async execFile(cmd, args, dir) {
		const { stdout, stderr } = await execFile(cmd, args, {cwd: dir});
		return this.execInfo(stdout, stderr);
	}
}