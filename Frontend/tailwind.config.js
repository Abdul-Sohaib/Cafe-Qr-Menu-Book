/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {        // For nav links
        heading: ["DM", 'Serif Display'],      // For bold sketch headings
        heading2: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],        // For body text
      },
      // Custom breakpoints for better responsive control
screens: {
  // xs now includes the custom range condition (300px to 600px)
  'xs': { 'min': '300px', 'max': '600px' },   // applies from 300px to 600px only
  'sm': { 'min': '601px' },                   // ≥ 601px
  'md': { 'min': '768px' },                   // ≥ 768px                // ≥ 1920px
}

    },
  },
  plugins: [],
}