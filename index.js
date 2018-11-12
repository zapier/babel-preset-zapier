const declare = require('@babel/helper-plugin-utils').declare;
const buildTargets = require('@zapier/browserslist-config-zapier');

module.exports = declare(api => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  // Make sure the consumer is using babel v7
  api.assertVersion(7);
  // Tell babel we can cache the resolution of this config based on the value of `env`.
  api.cache.using(() => env);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: env === 'test' ? 'commonjs' : false,
          targets: {
            browsers: buildTargets,
          },
        },
      ],
      '@babel/preset-react',
      '@babel/preset-flow',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      // Need to force-transform default parameter syntax. See: https://github.com/babel/babel/issues/8349
      // Once the fix for that issue lands, we can upgrade `babel-preset-env` and get rid of this
      '@babel/plugin-transform-parameters',
      // Need to force-transform classes due to an Edge bug. See: https://github.com/zapier/zapier/pull/21319#issuecomment-437871079
      // Once the fix for this lands on Edge, we can get rid of this (but make sure to test in older versions of Edge first!).
      '@babel/plugin-transform-classes',
    ],
    env: {
      development: {
        plugins: [
          [
            'emotion',
            {
              autoLabel: true,
              labelFormat: '[filename]--[local]',
              sourceMap: true,
            },
          ],
        ],
      },
      test: {
        plugins: ['dynamic-import-node'],
      },
      production: {
        plugins: ['transform-react-remove-prop-types', 'graphql-tag'],
      },
    },
  };
});
