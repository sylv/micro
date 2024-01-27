/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  plugins: [
    require('@tailwindcss/typography'),
    ({ addBase, addComponents, theme }) => {
      addBase({
        h1: { fontSize: theme('fontSize.2xl') },
        h2: { fontSize: theme('fontSize.xl') },
        h3: { fontSize: theme('fontSize.lg') },
        kbd: {
          color: theme('colors.primary'),
        },
        body: {
          color: 'white',
          backgroundColor: '#141414',
          'overflow-y': 'overlay',
        },
        '#__next': {
          height: '100vh',
        },
        '::selection': {
          color: 'white',
          backgroundColor: theme('colors.violet.600'),
        },
      });

      addComponents({
        '.dots': {
          backgroundImage: 'radial-gradient(black 1px, transparent 0)',
          backgroundSize: '40px 40px',
        },
      });
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a78bfa',
        gray: {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        dark: {
          100: '#121212',
          200: '#1d1d1d',
          300: '#212121',
          400: '#242424',
          500: '#272727',
          600: '#2c2c2c',
          700: '#2d2d2d',
          800: '#333333',
          900: '#353535',
          999: '#373737',
        },
        blue: {
          50: '#AACEFF',
          100: '#95C2FF',
          200: '#6CABFF',
          300: '#4494FF',
          400: '#1B7CFF',
          500: '#0067F1',
          600: '#004FB9',
          700: '#003781',
          800: '#001F49',
          900: '#000711',
        },
      },
    },
  },
};
