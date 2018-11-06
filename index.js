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
