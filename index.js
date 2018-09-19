'use strict';

const buildTargets = require('@zapier/browserslist-config-zapier');

function buildPreset(context, options) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  const defaultModules = env === 'test' ? 'commonjs' : false;
  const modules = options && options.modules ? 'commonjs' : defaultModules;

  return {
    presets: [
      require('babel-preset-env').default(null, {
        modules,
        targets: {
          browsers: buildTargets,
        }
      }),
      require('babel-preset-react'),
      require('babel-preset-stage-2'),
    ],

    plugins: [
      env === 'production'
        ? require('babel-plugin-transform-react-remove-prop-types').default
        : null,
    ].filter(Boolean),
  };
}

module.exports = buildPreset;
