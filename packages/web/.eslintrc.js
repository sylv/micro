module.exports = {
  extends: require.resolve('@atlasbot/configs/eslint/next'),
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {},
};
