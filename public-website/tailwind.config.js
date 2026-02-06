/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
  extend: {
    colors: {
      primary: "#0D9488",   // Teal
      secondary: "#67E8F9", // Aqua
      accent: "#F97316",    // Orange
    },
  },
},
  plugins: [],
};
