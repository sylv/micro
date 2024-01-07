module.exports = {
  extends: require.resolve('@atlasbot/configs/eslint/next'),
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/media-has-caption': 'off',
  },
};
