module.exports = {
  extends: require.resolve('@sylo-digital/scripts/eslint/react'),
  ignorePatterns: ['**/generated/**'],
  rules: {
    '@typescript-eslint/consistent-type-assertions': 'off',
    'storybook/no-title-property-in-meta': 'off',
    'jsx-a11y/media-has-caption': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
  },
};
