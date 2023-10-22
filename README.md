Wiki to Git
==========================
<img align="right" width="150" height="150" src="https://raw.githubusercontent.com/Eccenux/wiki-to-git/main/assets/wiki-to-git-logo.svg">

**Wiki To Git** is a tool that helps to download MediaWiki page history and push it to a Git repository.

You can used it to export things like a Wikipedia gadget to some Git server (e.g. GitHub or GitLab or Gitea). Or e.g. export your a user script to Git and work on it locally. The history of the Git repo will preserve authors and original messages (original description of changes). Essentially each edit becomes a commit.

Once done you can start using external tools to edit and analyze history of the gadget. You can use [Wikiploy](https://github.com/Eccenux/Wikiploy) to deploy your gadget back to Wikipedia. You can also test easier with things like [Mocha](https://mochajs.org/#installation)/[Chai](https://www.chaijs.com/api/assert/). You can also use build tools like [Browserify](https://browserify.org/) or [Webpack](https://webpack.js.org/). Wikiploy will also help in deploying dev/test versions.

## Using tools

### Basic steps

**Step. 1.** Install tools via npm (Node.js):
```bash
npm i -g wiki-to-git
```

**Step. 2.** Load history metadata from wiki (this will create a `history.json` file):
```bash
wiki2git-load --site meta.wikimedia.org -p "User:Nux/global.js"
```

To see more options use:
```bash
wiki2git-load --help
```

**Step. 3.** Commit to a new or existing repo:
```bash
wiki2git-commit --site meta.wikimedia.org --repo "global-JS-CSS" -o "global.js"
```

This will automatically:
1. Create a "global-JS-CSS" repositry.
2. Download revisions from the site.
3. Create a file `global-JS-CSS/global.js`.

That is it. You should check if the history of the git repo is OK and you can push it to your Git server (like e.g. Github).

### More files

If you want to download more files, just run similar steps again. The repository will be detected, and commits will be added for the new file.

For example you might want to add CSS:
```bash
wiki2git-load --site meta.wikimedia.org -p "User:Nux/global.css"
wiki2git-commit --site meta.wikimedia.org --repo "global-JS-CSS" -o "global.css"
```

## Creating a script (not using cmd)

I recommend using cmd tools, but you can also use a Node script if you prefer.
See [README-classes.md](README-classes.md)

## Troubleshooting

### Supported Node versions

You'll need [Node.js](https://nodejs.org/en) for this tool and your safest choice is the latest LTS version.

Wiki2git 1.1 has been successfully tested with Node versions 14, 16, 18, and 20.

### Review git history

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
