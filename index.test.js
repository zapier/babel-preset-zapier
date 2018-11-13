/* eslint-env jest */
const babel = require('@babel/core');

const transform = code => {
  return babel.transformSync(code, {
    configFile: require.resolve('./index'),
    babelrc: false, // don't use .babelrc
  }).code;
};

describe('babel-preset-zapier', () => {
  beforeEach(() => {
    process.env.BABEL_ENV = 'development';
  });

  afterEach(() => {
    delete process.env.BABEL_ENV;
  });

  it("doesn't compile ES modules to commonjs", () => {
    const code = `
      import Foo from 'foo';
    `;

    expect(transform(code)).toMatchSnapshot();
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

  describe('when on production env', () => {
    beforeEach(() => {
      process.env.BABEL_ENV = 'production';
    });

    afterEach(() => {
      delete process.env.BABEL_ENV;
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

      expect(transform(code)).toMatchSnapshot();
    });
  });

  describe('when on test env', () => {
    beforeEach(() => {
      process.env.BABEL_ENV = 'test';
    });

    afterEach(() => {
      delete process.env.BABEL_ENV;
    });

    it('compiles to commonjs modules in test environment', () => {
      const code = `
      import Foo from 'foo';
    `;

      expect(transform(code)).toMatchSnapshot();
    });
  });
});
