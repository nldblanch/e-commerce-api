import prettier from "eslint-plugin-prettier";
import prettierRecommended from "eslint-config-prettier";
import jestFormatting from "eslint-plugin-jest-formatting";
export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      prettier,
      jestFormatting,
    },
    ...prettierRecommended,
    rules: {
      "prettier/prettier": "error",
      semi: ["warn", "always"],
      "jestFormatting/padding-around-describe-blocks": 2,
      "jestFormatting/padding-around-test-blocks": 2,
    },
  },
];
