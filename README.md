# 🏯 babel-preset-zapier

A babel preset for Zapier. Heavily inspired by [`babel-preset-airbnb`](https://github.com/airbnb/babel-preset-airbnb).


## Features
- Uses [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
- Defaults to a sane list of browser versions (based on [https://github.com/zapier/browserslist-config-zapier](browserslist-config-zapier)).
- ES modules by default (override with `modules: true` option for commonjs).
- Handles extra configuration for testing with Jest for you.
- Removes PropTypes definitions in production.


## Options
- `modules` - Set this to `true` if you want to compile to commonjs modules. Otherwise, the default is ES modules.
