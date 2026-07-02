import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

// Flat config (ESLint 9+/10). Mirrors the previous .eslintrc.cjs:
// eslint:recommended + @typescript-eslint/recommended + svelte/recommended + prettier.
export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Injected at runtime by the Google Analytics (gtag.js) snippet
        gtag: 'readonly',
        dataLayer: 'writable'
      }
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
        svelteConfig
      }
    }
  },
  {
    // Build output & artifacts (ESLint 10 flat config no longer auto-ignores
    // dot-dirs or reads .eslintignore, so list them explicitly).
    ignores: [
      'build/',
      '.svelte-kit/',
      '.netlify/',
      'package/',
      'dist/',
      'cypress/videos/',
      'cypress/screenshots/'
    ]
  }
);
