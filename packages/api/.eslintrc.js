module.exports = {
  extends: require.resolve('@sylo-digital/scripts/eslint/base'),
  overrides: [
    {
      files: ['**/*.{entity,embeddable}.ts'],
      rules: {
        '@typescript-eslint/no-inferrable-types': 'off',
      },
    },
  ],
};
