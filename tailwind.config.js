/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [],
  theme: {
    extend: {
      colors: {
        primary: "#009688",
        primaryLite: "#e7f5f4",
        "primary-2": "#80CBC4",
        primaryDark: "#00786c",
        secondary: "#444F60",
        "secondary-hover": "#596474",
        "secondary-dark": "#313131",
        "secondary-lite": "#f1f1f1",
        "secondary-2": "#556987",
        "secondary-3": "#C1C1C1",
        "secondary-4": "#C7CACF",
        "secondary-5": "#444444",
        "secondary-6": "#697280",
        "secondary-7": "#ECECEC",
        "secondary-8": "#ffffff",
        "hahu-red": "#991B1B",
        "hahu-red-2": "#DC2626",
        "hahu-red-3": "#FEE2E2",
        "hahu-gray": "#444F60",
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
      },
    },
  },

  darkMode: "class",
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
