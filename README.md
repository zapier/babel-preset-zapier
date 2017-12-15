# babel-preset-zapier

A babel preset for Zapier. Heavily inspired by [`babel-preset-airbnb`](https://github.com/airbnb/babel-preset-airbnb).


## Features
- Uses [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- Defaults to a sane list of browser versions (specify additional via `additionalTargets`).
- ES modules by default (override with `modules: true` option for commonjs).
- Handles extra configuration for testing with Jest for you.
- Removes PropTypes definitions in production


## Options
- `additionalTargets` - Array of [browserlist](https://github.com/ai/browserslist) queries specifying additional compilation targets.
- `modules` - Set this to `true` if you want to compile to commonjs modules. Otherwise, the default is ES modules.
