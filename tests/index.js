/* eslint-env jest */
const babel = require('babel-core');
const omit = require('lodash.omit');
const buildPreset = require('../index');

const transform = (code, options, fakeEnvironment) => {
  const presetConfig = buildPreset(null, options);

  const babelConfig = Object.assign(
    presetConfig,
    {
      babelrc: false, // don't use .babelrc
      env: omit(presetConfig.env, 'test'), // get rid of test env, otherwise we can't test non-test env scenarios
    },
    presetConfig.env[fakeEnvironment] || {}
  );

  return babel.transform(code, babelConfig).code;
};

describe('babel-preset-zapier', () => {
  it("doesn't compile ES modules to commonjs by default", () => {
    const code = `
      import Foo from 'foo';
    `;

    expect(transform(code)).toMatchSnapshot();
  });

  it('compiles to commonjs modules if `modules: true` option is passed', () => {
    const code = `
      import Foo from 'foo';
    `;

    expect(transform(code, { modules: true })).toMatchSnapshot();
  });

  it('strips flow annotations', () => {
    const code = `
        type Foo = {
          bar: string
        };

        function greet(name: string) {}
      `;

    expect(transform(code)).toMatchSnapshot();
  });

  it('compiles JSX', () => {
    const code = `
      <Foo />;
    `;

    expect(transform(code)).toMatchSnapshot();
  });

  // This test will break when we drop IE11 support
  it('compiles `const` to `var`', () => {
    const code = `
      const foo = 'bar';
    `;

    expect(transform(code)).toMatchSnapshot();
  });

  it('doesnt strip proptypes when not in prod env', () => {
    const code = `
      const Baz = (props) => (
        <div {...props} />
      );

      Baz.propTypes = {
        className: PropTypes.string
      };
    `;

    expect(transform(code)).toMatchSnapshot();
  });

  it('strips proptypes when in prod env', () => {
    const code = `
      const Baz = (props) => (
        <div {...props} />
      );

      Baz.propTypes = {
        className: PropTypes.string
      };
    `;

    expect(transform(code, {}, 'production')).toMatchSnapshot();
  });
});
