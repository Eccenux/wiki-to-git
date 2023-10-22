Development
==========================

Wiki2git is a Node.js project and is configured to use VSCode for development.

Wiki2git is publishing two things:
- JS classes (via `main.js`).
- Command line tools (via `bin` in `package.json`).


Preparation
----------------------

### Install Nodejs
You'll definitely need [Node.js](https://nodejs.org/en), and your safest choice is the latest LTS version.

Wiki2git 1.1 has been successfully tested with Node versions 14, 16, 18, and 20.

### Install modules
Run first `npm i`.
You might want to run `npm up` to update some scripts too.

Recomended global modules/tools:
```bash
npm install -g eslint
```
You mostly need above if you will be using your shell (command line).


Command line tools
----------------------

Command line tools are defined as `bin` scripts in the `package.json`.

### Debugging cmd tools

To make debugging easier actual script is spearated from a command line tool.
So e.g. `src\cmd-load.js` defines `runScript` and can be used for debugging.
And `src\cmd-load-cmd.js` is only parsing command line arguments (and executing `runScript`).

### Running local bin

Check help:
```
npx wiki2git-load --help
npx wiki2git-commit --help
```

Example:
```
npx wiki2git-load --site meta.wikimedia.org -p "User:Nux/global.js" -l 3
npx wiki2git-commit --site meta.wikimedia.org --repo "repo/global-test" -o "global.js"
```


Publishing
----------------------

Step 1. Check and update versions.
```bash
# 1: update version in package.json
# 2: audit check and update package-lock
npm i
# 3: (optional) update modules 
npm up
```

Step 2. Test. Note! Tests in this project are *slow* (especially `LoadData` tests).
```bash
npm test
```
 
Step 3. Final command(s).
```bash
npm publish
```
