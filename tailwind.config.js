const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./aragorn/**/*.{js,ts,jsx,tsx}",
    "./elrond/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      dropShadow: {
        mac: "0 22px 70px 4px rgba(0, 0, 0, 0.56)",
      },
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Montserrat", "serif"],
      header: ["Luckiest Guy", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.zinc,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue: colors.blue,
      app: {
        bg: "#f2f2f2",
        textheader: "#303345",
        textbody: "#545459",
      },
      pallete: {
        primary: "#FFB830",
        secondary: "#308BFF",
        third: "#2C786C",
        fourth: "#FAF5E4",
        accent: "#5a3fff",
      },
    },

    container: {
      padding: "1rem",
      center: true,
    },
    extend: {
      borderRadius: {
        4: "4px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
