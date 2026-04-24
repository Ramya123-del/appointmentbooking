import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['dist'], // fixed

    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended
      // removed unstable vite config
    ],

    languageOptions: {
      ecmaVersion: 'latest', // keep only one
      sourceType: 'module',

      globals: globals.browser,

      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },

    plugins: {
      'react-refresh': reactRefresh
    },

    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': 'warn'
    }
  }
])