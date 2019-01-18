module.exports = {
  plugins: ['@zapier/zapier'],
  extends: ['plugin:@zapier/zapier/prettier'],
  overrides: [
    {
      files: ['index.test.js'],
      env: { jest: true },
    },
  ],
};
