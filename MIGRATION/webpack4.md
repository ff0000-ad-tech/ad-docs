# Webpack 4 Migration

## Changes
- Introduces new `@index` alias, which allows for script and/or payload variations per index file
  - `@index` resolves to a directory that is the index file name without the .html extension. For example, if compiling a build for `index_onchannel.html`, `@index` would resolve to `index_onchannel`
  - If no file exists after `@index` is resolved, it simply falls back to the parent directory that would have held the index folder. For example, if importing from `./images/@index/pic.jpg` and no index-specific folders exists, the resolver will import from `./images/pic.jpg` instead and let the developer know
  - If the resolver still can't find a file after falling back to the parent directory, Webpack will import an error about being unable to resolve the file, per usual 
- Updated all of our Webpack plugins to use the new plugin/[Tapable](https://github.com/webpack/tapable) API
- Updated Deploy Manager to use these Webpack 4 plugins as well as using [this Uglify plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) since Uglify is no longer included within Webpack's core package
- Adjusted [wp-plugin-asset's](https://github.com/ff0000-ad-tech/wp-plugin-assets) recursive binary asset finding for Webpack's new internal graph representation
- Using Webpack 4 modes:
  - `development` in debug settings, which seems to only include plugins that work with HMR
  - `production` in production settings, which contain plugins focused on optimization, such as on file size or browser performance
  - more notes on mode and mode-specific plugins available [here](https://github.com/derekmiranda/ad-tech-notes/blob/master/webpack_4/mode_plugins.md)

## What would the migration affect?
- If one reinstalls the packaging dependencies from a project that still uses Webpack 3 and uses "latest" on the packaging dependencies, this will cause compiling to break, signaling a need to migrate
- Newly built ads would have different packaging dependencies but should still work independently of the Ad Framework dependencies

## Addressing ads breaking
If the watch process hangs for longer than 10 seconds, copy and run the watch command in a Terminal window. If an error that reads "Cannot read property 'watchRun' of undefined" shows up that prevents the compiling process from continuing, that means that your packaging is out of date.

Go ahead and:
1. Run the Ad App feature: "Update ES6 Packaging"
2. Delete the current `node_modules` folder and `package-lock.json` file
3. Reinstall dependencies with `npm install`

These steps should get you in sync with the updated packaging dependencies.

## What do we need to do?
- merge Webpack 4 changes to master, bump major versions of Deploy Manager and Webpack plugins, AND update deployed build sources
- Start using updating semver versions in packaging package.json to better avoid breaking changes in the future
- Let devs know that we've updated to Webpack 4
- Prepare for any older ads using Webpack 3 breaking when reinstalling
- Put in fallback, if possible - does not seem feasible, using Webpack 4 FAT plugins with Webpack 3 fallbacks causes the compilation to end at the build assets copying w/o throwing an error
