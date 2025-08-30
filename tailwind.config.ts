/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ajuste conforme seu projeto
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter Tight"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
