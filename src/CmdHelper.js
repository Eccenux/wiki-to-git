export class CmdHelper {
	/**
	 * @param {CmdHelper} params
	 */
	constructor({requiredOptions = [], program}) {
		/** @type {Array} List of required options. */
		this.requiredOptions = requiredOptions;
		/** @type {Command} Program defintion. */
		this.program = program;
	}

	/**
	 * Check options.
	 * @param {Object} options Options read from the user.
	 */
	check(options) {
		for (const key of this.requiredOptions) {
			// note that all options are expected to be a string
			if (typeof options[key] != 'string') {
				console.error('[ERROR] Required option is missing:', key, '\n');
				// console.info('Note! Use --help (or -h) for a longer description.\n');
				// this.program.description('');
				this.program.description('Note! Use --help (or -h) for a longer description.');
				this.program.help();
			}
		}
	}
}