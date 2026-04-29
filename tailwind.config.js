/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sf: {
          green: "#28A74573",
          greenDark: "#28A745B3",
          panel: "#E6E6E6",
          page: "#FFFFFF",
          ink: "#1a1a1a",
          btnBlue: "#008CFF",
          textWhite: "#FFFFFF",
          textBlack: "#000000",
          bgGray: "#D8D8D8",
          bgGrayLight: "#D8D8D8A1",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Arial", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};