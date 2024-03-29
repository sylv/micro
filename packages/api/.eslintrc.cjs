module.exports = {
  extends: require.resolve('@atlasbot/configs/eslint/node'),
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/filename-case': 'off',
    'import/no-default-export': 'off',
  },
};
