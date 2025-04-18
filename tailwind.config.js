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
        },
        instagram: {
          primary: '#405DE6',
          secondary: '#5851DB',
          tertiary: '#833AB4',
          quaternary: '#C13584',
          quinary: '#E1306C',
          senary: '#FD1D1D',
          septenary: '#F56040',
          octonary: '#F77737',
          nonary: '#FCAF45',
          denary: '#FFDC80'
        }
      }
    },
  },
  plugins: [],
}