// eslint-disable-next-line no-unused-vars
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
		/** Fake domain for e-mails. */
		this.fakeDomain = 'fake.wikipedia.org';
		/** Default branch. */
		this.branch = 'main';
		/** Default message (when empty). */
		this.emptyMessage = '-';
		this.emptyAuthor = '~anon';
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
		const result = await this.exec(`git init ${this.repoName} -b ${this.branch}`, this.baseDir);
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
		// git commit 
		// -m "Description from history"
		// --author="Some Author Name <Some-Author-Name@fake.wikipedia.org>"
		// --date='<ISO date>' 
		const args = ['commit'];
		args.push('-m'); args.push(this.pMessage(history));
		args.push(this.pAuthor(history));
		args.push(this.pDate(history));
		let env = {};
		env.GIT_COMMITTER_DATE = history.dt.trim();

		let result;
		try {
			result = await this.execFile('git', args, this.dir, env);
			if (!result) {
				throw 'Unable to commit changes!';
			}
		} catch (error) {
			if (error.code === 1 && error.stdout.search(/nothing to commit/) >= 0) {
				console.log('\n\nskipping empty commit:\n', history);
			} else {
				this.execInfo(error.stdout, error.stderr);
				throw(error);
			}
		}

		return result;
	}

	/** @private Date param. */
	pMessage(history) {
		let message = history.message.trim();
		if (!message.length) {
			message = this.emptyMessage;
		}
		return message;
	}
	/** @private Author param. */
	pAuthor(history) {
		// git commit ... --author="Some Author Name <Some-Author-Name@fake.wikipedia.org>"
		
		// base string
		let name = history.author.trim();
		// remove special characters
		name = name.replaceAll(/[-="'@<>+]/g, ' ').replaceAll(/ +/g, ' ').trim();
		// anon fallback
		if (!name.length) {
			console.warn('[WARNING] Author for rev %d (%s) is missing (removed?). Replacing with %s.', history.id, history.dt, this.emptyAuthor);
			name = this.emptyAuthor;
		}
		// mail-name
		let mail = name.replaceAll(/\s/g, '-');
		// final
		let arg = `--author="${name} <${mail}@${this.fakeDomain}>"`;
		return arg;
	}
	/** @private Date param. */
	pDate(history) {
		// git commit ... --date='<ISO 8601>'
		let dt = history.dt.toString().trim();
		let arg = `--date='${dt}'`;
		return arg;
	}

	/** @private Execute and report problems (unsafe!). */
	async exec(cmd, dir) {
		const { stdout, stderr } = await exec(cmd, {cwd: dir});
		return this.execInfo(stdout, stderr);
	}

	/** @private Report exec problems. */
	execInfo(stdout, stderr) {
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
	async execFile(cmd, args, dir, env) {
		const { stdout, stderr } = await execFile(cmd, args, {cwd: dir, env: env});
		return this.execInfo(stdout, stderr);
	}
}