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
      boxShadow: {
        box: "rgba(0, 0, 0, 0.10) 0px 3px 6px, rgba(0, 0, 0, 0.16) 0px 3px 6px;",
      },
      animation: {
        "fade-in": "fade 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards",
      },
      fontFamily: {
        primary: ["Montserrat"],
      },
      borderRadius: {
        "1/2": "50%",
      },
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
