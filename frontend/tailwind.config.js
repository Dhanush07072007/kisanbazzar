/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fbf8f3',
          100: '#f5efe4',
          200: '#eadcc7',
          300: '#dcbe9e',
          400: '#cb9e74',
          500: '#be8356',
          600: '#af6d47',
          700: '#91553c',
          800: '#764635',
          900: '#603b2e',
        }
      },
    },
  },
  plugins: [],
}
