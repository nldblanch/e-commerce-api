import prettier from "eslint-plugin-prettier";
import prettierRecommended from "eslint-config-prettier";
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      prettier,
    },
    ...prettierRecommended,
    rules: {
      "prettier/prettier": "error",
      semi: ["warn", "always"],
    },
  },
];
