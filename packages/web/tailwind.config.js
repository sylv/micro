const pandora = require('@ryanke/pandora/plugin');

module.exports = {
  content: ['./src/**/*.tsx', pandora.content],
  plugins: [require('@tailwindcss/typography'), pandora.plugin],
};
