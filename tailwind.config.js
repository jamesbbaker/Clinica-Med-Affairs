/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#387ADF",
      },
      borderWidth: {
        32: "32px",
      },
      zIndex: {
        minus: -1,
      },
      width: {
        lg: "28rem",
        dlg: "32rem",
      },
      height: {
        lg: "28rem",
        dlg: "32rem",
      },
    },
    boxShadow: {
      right: "10px 6px 10px -10px rgba(0,0,0,0.51)",
    },
  },
  plugins: [],
};
