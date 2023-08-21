import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FED761',
        primaryVariant: '#FFEC9B',
        secondary: '#0C5000',
        tertiary: '#D15819',
        background: '#FAFAFA',
        backgroundVariant: '#FFFFFF',
        primaryText: '#333',
        placeholderText: '#676767',
        radioBorder: '#262825',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [formsPlugin, typographyPlugin],
};
