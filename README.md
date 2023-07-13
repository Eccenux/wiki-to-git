Wiki to Git
==========================
<img align="right" width="150" height="150" src="https://raw.githubusercontent.com/Eccenux/wiki-to-git/main/assets/wiki-to-git-logo.svg">

**Wiki To Git** is a tool that helps to download Mediwiki page history and push it to a Git repository.

So this can be used to export things like a Wikipedia gadget (or a user script) to some Git server (e.g. Github or Gitlab or Gitea). The history of the Git repo will preserve authors and original messages (original description of changes). Essentially each edit becomes a commit.

Once done you can start using external tools to edit and analyze history of the gadget. You can use [Wikiploy](https://github.com/Eccenux/Wikiploy) to deploy your gadget back to Wikipedia. You can also test easier with things like [Mocha](https://mochajs.org/#installation)/[Chai](https://www.chaijs.com/api/assert/). You can also use build tools like [Browserify](https://browserify.org/) or [Webpack](https://webpack.js.org/). Wikiploy will also help in deploying dev/test versions.

## Basic steps

Step. 1. You can install it via npm:
```
npm i wiki-to-git
```

Step. 2. Create your export script (NodeJS script).

Step. 3. Run your script.

That is it. You should check if the history of the git repo is OK and you can push it to your Git server (like e.g. Github).

## Creating your script

Your export script should use `wiki-to-git` to create a new git repo.

TBC...

```js
import { LoadData } from 'wiki-to-git';

/**
 * Download page history from a Mediawiki site.
 */
const site = 'en.wikipedia.org';
const page = 'MediaWiki:Gadget-exampleGadgetScript.js';
const loader = new LoadData(site);
// this will load
await loader.load(page);
// this will save history as JSON
await loader.saveHistory();
// this just shows a quick info (you can skip this)
loader.info();
```

## External links
* [Wiki2git on npm](https://www.npmjs.com/package/wiki-to-git)
* [Wikiploy on npm](https://www.npmjs.com/package/wikiploy) – Wikiploy can be used to deploy from Git back to Wikipedia.
