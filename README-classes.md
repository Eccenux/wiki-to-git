Wiki to Git
==========================
<img align="right" width="150" height="150" src="https://raw.githubusercontent.com/Eccenux/wiki-to-git/main/assets/wiki-to-git-logo.svg">

Using `Wiki To Git` classes.

I recommend using cmd tools, but you can also use a Node script if you prefer.

## Creating your script

Your export script should use `wiki-to-git` to create a new git repo.

Most of the time you will only need to change the top configuration from the snippet below.
```js
import { LoadData } from 'wiki-to-git';

//
// Config.
// change this values to your needs
const site = 'en.wikipedia.org';
const page = 'MediaWiki:Gadget-exampleGadgetScript.js';
const repoName = 'wiki-exampleGadgetScript';
const filename = 'exampleGadgetScript.js';

const loader = new LoadData(site);

/**
 * Download page history from a MediaWiki site.
 */
console.log('\n\nDownload history for %s.', page);
// this will load
await loader.load(page);
// this will save history as JSON
await loader.saveHistory();
// this just shows a quick info (you can skip this)
loader.info();

// You only need to read JSON if you changed it.
// Use load (and saveHistory) xor readHistory.
/**
 * Read page history from JSON.
 *
loader.history = [];
await loader.readHistory();
loader.info();

/**
 * Create Git repo.
 */
console.log('\n\nCreating Git repo (%s).', repoName);
loader.repoCreate(repoName);
console.log('\nSave history as %s.', filename);
loader.repoCommit(repoName, filename);
```

That's it. Run this script in Node.js and you are done.
