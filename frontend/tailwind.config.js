/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      clipPath: {
        heart:
          'path("M24 4.557c-2.834-5.18-9.82-5.287-12 0C9.82-.73 2.834-.623 0 4.557c-2.51 4.595-.45 10.456 4.5 13.993L12 24l7.5-5.45c4.95-3.537 7.01-9.398 4.5-13.993z")',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in forwards',
      },
    },
  },
  plugins: [],
};
