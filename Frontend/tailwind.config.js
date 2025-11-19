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
  'xs': { 'min': '300px', 'max': '600px' },   // applies from 300px to 600px only
  'sm': { 'min': '601px' },                   // ≥ 601px
  'md': { 'min': '768px' },                   // ≥ 768px                // ≥ 1920px
},
    },
  },
  plugins: [],
}