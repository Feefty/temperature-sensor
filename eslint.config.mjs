import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Allow intentionally unused args/vars prefixed with underscore.
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // CommonJS config files (e.g. jest.config.js)
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  },

  // Backend: Node environment
  {
    files: ['api/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Frontend: React + browser
  {
    files: ['web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },

  // vite.config.ts is a Node build-tool file, not browser source.
  { files: ['web/vite.config.ts'], languageOptions: { globals: { ...globals.node } } },

  prettier,
);
