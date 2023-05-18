import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#FFFFFF",
      "dark-blue": "#6F8D9C",
      "light-blue": "#BDCACF",
      "egg-white": "#FDF7F4",
      "light-pink": "#F6CAC9",
      "dark-pink": "#C4475C",
      orange: "#F4B855",
    },
    fontFamily: {
      heading: ["Satoshi-Black", "sans-serif"],
      body: ["Satoshi-Regular", "sans-serif"],
      type: ["Typewrite Condensed", "sans-serif"],
    },
    fontWeight: {
      normal: "400",
      bold: "900",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
