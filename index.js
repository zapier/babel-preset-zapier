'use strict';

const modules = [
  require('babel-plugin-transform-es2015-modules-commonjs'),
  {
    strict: false,
  },
];

// See full breakdown here: http://bit.ly/2B3PCj3
const defaultTargets = [
  'last 4 Chrome major versions',
  'last 3 ChromeAndroid major versions',
  'last 2 ios major versions',
  'last 3 Edge major versions',
  'last 4 Firefox major versions',
  'last 3 Safari versions',
  'IE 11',
];

function getBuildTargets(options) {
  const additionalTargets = options.additionalTargets || [];
  return defaultTargets.concat(additionalTargets);
}

function buildPreset(context, options) {
  const buildTargets =
    (options && options.targets) || getBuildTargets(options || {});

  return {
    presets: [
      require('babel-preset-env').default(null, {
        modules: false,
        targets: buildTargets,
      }),
      require('babel-preset-react'),
      require('babel-preset-stage-2'),
    ],

    plugins: options && options.modules ? [modules] : [],

    env: {
      production: {
        plugins: [require('babel-plugin-transform-react-remove-prop-types')],
      },
      test: {
        presets: [
          require('babel-preset-env').default(null, {
            modules: 'commonjs',
            targets: buildTargets,
          }),
        ],
        plugins: [],
      },
    },
  };
}

module.exports = buildPreset;
