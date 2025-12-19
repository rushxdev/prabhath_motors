
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-purple": "#rgba(255,255,255,0.17)",
      },
    },
  },
  plugins: [],
}