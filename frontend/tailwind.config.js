/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        firstLavender: "#575799",
        firstBrown: "#865200",
        firstGreen: "#00728b",
        FirstDarkBlue: "#00023d",
      },
    },
  },
  plugins: [],
};
