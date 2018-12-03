# 🏯 babel-preset-zapier

A babel preset for Zapier. Heavily inspired by [`babel-preset-airbnb`](https://github.com/airbnb/babel-preset-airbnb).

## Installation

`yarn add --dev @zapier/babel-preset-zapier`

## Features

- Uses [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- Defaults to a sane list of browser versions (based on [https://github.com/zapier/browserslist-config-zapier](browserslist-config-zapier)).
- ES modules by default.
- Handles extra configuration for testing with Jest for you.
- Supports dynamic `import()` statements, object rest-spread and class properties.
- Removes PropTypes definitions in production.
- Compiles GraphQL tagged template strings in production.
- Configures `emotion` to add filepaths to classNames by default.

Note that `babel-preset-zapier` currently does not support babel versions lower than v7.

## Publishing / Deploying

- Use [semantic versioning](https://semver.org/) for deciding how to bump versions.
- `npm publish` to publish the new version to NPM.
