const buildTargets = require('@zapier/browserslist-config-zapier');
const declare = require('@babel/helper-plugin-utils').declare;
const invariant = require('invariant');

const compact = xs => xs.filter(Boolean);

const validateTargetOption = (target = 'browser') => {
  const validTargets = ['browser', 'node'];
  invariant(
    validTargets.includes(target),
    `Invalid option: The target option '${target}' should be either 'browser' or 'node'.`
  );
  return target;
};

const normalizeOptions = (options = {}) => ({
  target: validateTargetOption(options.target),
});

module.exports = declare((api, options) => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const { target } = normalizeOptions(options);

  // Make sure the consumer is using babel v7
  api.assertVersion(7);
  // Tell babel we can cache the resolution of this config based on the value of `env`.
  api.cache.using(() => env);

  return {
    presets: compact([
      [
        '@babel/preset-env',
        {
          modules: env === 'test' || target === 'node' ? 'commonjs' : false,
          targets:
            target === 'browser'
              ? {
                  browsers: buildTargets,
                }
              : {
                  node: 'current',
                },
        },
      ],
      target === 'browser' && '@babel/preset-react',
      '@babel/preset-flow',
    ]),
    plugins: compact([
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      // Need to force-transform classes due to an Edge bug. See: https://github.com/zapier/zapier/pull/21319#issuecomment-437871079
      // Once the fix for this lands on Edge, we can get rid of this (but make sure to test in older versions of Edge first!).
      target === 'browser' && '@babel/plugin-transform-classes',
      env === 'test' && 'babel-plugin-require-context-hook',
    ].filter(Boolean),
    env: {
      development: {
        plugins: compact([
          target === 'browser' && [
            'emotion',
            {
              autoLabel: true,
              labelFormat: '[filename]--[local]',
              sourceMap: true,
            },
          ],
        ]),
      },
      test: {
        plugins: compact([target === 'browser' && 'dynamic-import-node']),
      },
      production: {
        plugins: compact([
          target === 'browser' && 'transform-react-remove-prop-types',
          'graphql-tag',
        ]),
      },
    },
  };
});
