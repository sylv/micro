module.exports = {
  extends: require.resolve('@atlasbot/configs/eslint/node'),
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'unicorn/no-abusive-eslint-disable': 'off',
  },
};
