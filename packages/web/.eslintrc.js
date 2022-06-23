module.exports = {
  extends: require.resolve('@sylo-digital/scripts/eslint/react'),
  rules: {
    '@typescript-eslint/consistent-type-assertions': 'off',
    'storybook/no-title-property-in-meta': 'off',
    'jsx-a11y/media-has-caption': 'off',
  },
};
