const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = [
  // 🔥 ignore dist proprement ici
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",

        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },

    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];