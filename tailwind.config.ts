import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    screens: {},
    extend: {
      colors: {
        brand: {
          100: "#D2EFE1",
          200: "#AFE3CA",
          500: "#44BE83",
          600: "#3AA26F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
