/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008DDA",
      },
      height: {
        extraLarge: "34rem",
        large: "30rem",
      },
      width: {
        extraLarge: "34rem",
        large: "30rem",
      },
    },
  },
  plugins: [],
};
