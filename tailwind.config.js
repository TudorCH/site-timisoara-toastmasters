/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#004165', light: '#00537f', dark: '#002d47' },
        maroon:   { DEFAULT: '#772432', light: '#8c2b3b', dark: '#5c1a25' },
        gold:     { DEFAULT: '#F2DF74', light: '#f7ea99', dark: '#dcc83a' },
        'tm-gray': { DEFAULT: '#A9B2B1' },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
