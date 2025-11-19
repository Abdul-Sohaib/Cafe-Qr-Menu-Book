/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
screens: {
  // xs now includes the custom range condition (300px to 600px)
  'xs': { 'min': '300px', 'max': '600px' },
  'xs-small': { 'min': '360px', 'max': '480px' },
},
    },
  },
  plugins: [],
}