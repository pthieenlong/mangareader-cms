import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'dist/**',
      "build/**",
      'node_modules/**',
      'public/**',
      '.cursor/**',
      '.husky/**',
      '.lintstagedrc.js',
      '.prettierignore',
      '.prettierrc',
      '.babelrc',
      '.env.local',
      '.env.local.example',
      'src/docs/**',
      'src/assets/global.css',
    ],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
