const buildTargets = require('@zapier/browserslist-config-zapier');
const declare = require('@babel/helper-plugin-utils').declare;
const invariant = require('invariant');

const compact = (xs) => xs.filter(Boolean);

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

const configurePresets = (env, target) =>
  compact([
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
    '@babel/preset-react',
    '@babel/preset-flow',
  ]);

const configureOverrides = (env, target) =>
  compact([
    {
      test: /\.tsx?$/,
      presets: [
        ...configurePresets(env, target).filter(
          (preset) => preset !== '@babel/preset-flow'
        ),
        [
          '@babel/preset-typescript',
          {
            allExtensions: true,
            isTSX: true,
            onlyRemoveTypeImports: true,
          },
        ],
      ],
    },
  ]);

const configurePlugins = (env, target) =>
  compact([
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    // Need to force-transform classes due to an Edge bug. See: https://github.com/zapier/zapier/pull/21319#issuecomment-437871079
    // Once the fix for this lands on Edge, we can get rid of this (but make sure to test in older versions of Edge first!).
    target === 'browser' && '@babel/plugin-transform-classes',
    env === 'test' && 'babel-plugin-require-context-hook',
    // See: https://github.com/zapier/zapier/pull/31809#discussion_r332164627
    'react-hot-loader/babel',
    target === 'browser' && [
      'emotion',
      {
        // autoLabel for all environments
        autoLabel: true,
        labelFormat: '[filename]--[local]',
        sourceMap: env === 'development',
      },
    ]
  ]);

const configureEnv = () => ({
  test: {
    plugins: ['dynamic-import-node'],
  },
  production: {
    plugins: ['transform-react-remove-prop-types', 'graphql-tag'],
  },
});

module.exports = declare((api, options) => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const { target } = normalizeOptions(options);

  // Make sure the consumer is using babel v7
  api.assertVersion(7);
  // Tell babel we can cache the resolution of this config based on the value of `env`.
  api.cache.using(() => env);

  return {
    presets: configurePresets(env, target),
    overrides: configureOverrides(env, target),
    plugins: configurePlugins(env, target),
    env: configureEnv(env, target),
  };
});
