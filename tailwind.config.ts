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
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'], // Pretendard를 기본 sans-serif로 설정
      },
      fontWeight: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
        900: '900',
      },
      colors: {
        brand: {
          50: "#ECF9F3",
          100: "#D2EFE1",
          200: "#AFE3CA",
          300: "#89D6B1",
          500: "#44BE83",
          600: "#3AA26F",
        },
        red: {
          300: "#FCA5A5",
          500: "#EF4444",
        }
      },
    },
  },
  plugins: [],
};
export default config;
