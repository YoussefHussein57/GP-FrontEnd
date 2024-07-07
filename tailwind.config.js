const { text } = require("@fortawesome/fontawesome-svg-core");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "4rem",
      },
      colors: {
        primary: "#fff",
        secondary: "#00B87C",
        accent: "#ef8354",
        text: "#000",
        background: "#faebd7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
