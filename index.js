'use strict';

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
  return {
    browsers: defaultTargets.concat(additionalTargets),
  };
}

function buildPreset(context, options) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const buildTargets =
    (options && options.targets) || getBuildTargets(options || {});

  const defaultModules = env === 'test' ? 'commonjs' : false;
  const modules = options && options.modules ? 'commonjs' : defaultModules;

  return {
    presets: [
      require('babel-preset-env').default(null, {
        modules,
        targets: buildTargets,
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
