/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cultural: {
          escenicas: '#FF7F50',
          visuales: '#4B0082',
          musicales: '#1E90FF'
        }
      }
    },
  },
  plugins: [],
}