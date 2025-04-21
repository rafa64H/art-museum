/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        loadingAnimation: "spin 600ms ease-in-out infinite",
      },
      colors: {
        firstLavender: "#575799",
        firstBrown: "#865200",
        firstGreen: "#00728b",
        firstDarkBlue: "#00023d",
        mainBg: "#333775",
      },
    },
  },
  plugins: [],
};
