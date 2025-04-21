/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  arrowParens: "avoid",
  endOfLine: "auto",
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@/apis/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/(.*)$",
    "^(?:@/utils/|@/lib/|@/store/|@/contexts/)(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
