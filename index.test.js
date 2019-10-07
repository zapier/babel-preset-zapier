const babel = require('@babel/core');

const transform = (code, filename = 'foo.js') => {
  return babel.transformSync(code, {
    configFile: require.resolve('./index'),
    babelrc: false, // don't use .babelrc
    filename,
  }).code;
};

// For testing purposes, we are just using the production version
// of react-hot-loader/babel so we don't get extra output in our files
jest.mock('react-hot-loader/babel', () =>
  require('react-hot-loader/dist/babel.production.min.js')
);

const tetstConfig = () =>
  require('./index')({
    assertVersion: () => true,
    cache: {
      using: () => {},
    },
  });

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

  it("doesn't strip proptypes when not in prod env", () => {
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

  it('transpiles TS', () => {
    const code = `
      const x: number = 7;
      type Foo = string | any;
    `;

    expect(transform(code, 'foo.ts')).toMatchSnapshot();
  });

  it('transpiles TSX', () => {
    const code = `
      import * as React from 'react';
      
      interface IProps {
        foo: string;
      }

      export function Thing(props: IProps) {
        return <h1>{props.foo}</h1>;
      }
    `;

    expect(transform(code, 'foo.tsx')).toMatchSnapshot();
  });

  it('transpiles TSX with isolateComponent pragma', () => {
    const code = `
      // @jsx isolateComponent
      
      interface IProps {
        foo: string;
      }

      export function Thing(props: IProps) {
        return <h1>{props.foo}</h1>;
      }
    `;

    expect(transform(code, 'foo.tsx')).toMatchSnapshot();
  });

  it('transpiles TSX with emotion jsx pragma', () => {
    const code = `
      /** @jsx jsx */
      import { css, jsx } from '@emotion/core';
      const styles = css({
        display: 'block',
      });
      interface IProps {
        foo: string;
      }

      export function Thing(props: IProps) {
        return <h1 css={styles}>{props.foo}</h1>;
      }
    `;

    expect(transform(code, 'foo.tsx')).toMatchSnapshot();
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

    it('produce the appropriate configuration', () => {
      const config = tetstConfig();
      expect(config).toMatchSnapshot();
    });
  });

  describe('given a target option', () => {
    const testConfig = options =>
      require('./index')(
        {
          assertVersion: () => true,
          cache: {
            using: () => {},
          },
        },
        options
      );

    it('produces the appropriate configuration for browser', () => {
      const config = testConfig({ target: 'browser' });
      expect(config).toMatchSnapshot();
    });

    it('produces the appropriate configuration for node', () => {
      const config = testConfig({ target: 'node' });
      expect(config).toMatchSnapshot();
    });
  });
});
