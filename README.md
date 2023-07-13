Wiki to Git
==========================
<img align="right" width="150" height="150" src="https://raw.githubusercontent.com/Eccenux/wiki-to-git/main/assets/wiki-to-git-logo.svg">

**Wiki To Git** is a tool that helps to download MediaWiki page history and push it to a Git repository.

So this can be used to export things like a Wikipedia gadget (or a user script) to some Git server (e.g. GitHub or GitLab or Gitea). The history of the Git repo will preserve authors and original messages (original description of changes). Essentially each edit becomes a commit.

Once done you can start using external tools to edit and analyze history of the gadget. You can use [Wikiploy](https://github.com/Eccenux/Wikiploy) to deploy your gadget back to Wikipedia. You can also test easier with things like [Mocha](https://mochajs.org/#installation)/[Chai](https://www.chaijs.com/api/assert/). You can also use build tools like [Browserify](https://browserify.org/) or [Webpack](https://webpack.js.org/). Wikiploy will also help in deploying dev/test versions.

## Basic steps

**Step. 1.** You can install it via npm:
```
npm i wiki-to-git
```

**Step. 2.** Create your export script (Node.js script).

**Step. 3.** Run your script.

That is it. You should check if the history of the git repo is OK and you can push it to your Git server (like e.g. Github).

## Creating your script (step. 2)

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

## Troubleshooting

If something goes wrong you might want remove the `.git` subdirectory 
from the generated repo and try again.

To check the details of the repo use this:
```
git log --pretty=fuller
```
This will show more details then typical log. Note that committer should be your Git account and the author should be an author from the Wiki page history.  

## External links
* [Wiki2git on npm](https://www.npmjs.com/package/wiki-to-git)
* [Wikiploy on npm](https://www.npmjs.com/package/wikiploy) – Wikiploy can be used to deploy from Git back to Wikipedia.
