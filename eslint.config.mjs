import js from "@eslint/js";
import plugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ["postcss.config.js"],
  },
  js.configs.recommended,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
      "@typescript-eslint": plugin,
    },
    languageOptions: {
      parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        { "no-console": "error" },
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }],
      "import/extensions": "off",
    },
  },
];
