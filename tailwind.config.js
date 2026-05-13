/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7f0',
          100: '#fdedd9',
          200: '#fbd7b1',
          300: '#f8b87e',
          400: '#f5904a',
          500: '#f07125',
          600: '#e1581b',
          700: '#bb4218',
          800: '#95361b',
          900: '#782f19',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
