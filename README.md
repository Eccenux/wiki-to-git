wiki2git
==========================

Wiki2git is a tool that import Mediwiki page history to a local Git repository.

So this can be used to export things like a Wikipedia gadget (or user script) to e.g. Github (or Gitlab or some other Git server).

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
