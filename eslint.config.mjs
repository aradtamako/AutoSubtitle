import { defineConfig, globalIgnores } from 'eslint/config'
import typescriptESLint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

const eslintConfig = defineConfig([
  globalIgnores([
    'dist/**',
    'build/**',
    '.wxt/**',
    '.output/**'
  ]),
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptESLint
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'semi': ['error', 'never'],
      'no-extra-semi': 'error',
      // 通常の文字列はシングルクォートを強制
      'quotes': ['error', 'single', { avoidEscape: true }],
      // JSX内ではダブルクォートを強制
      'jsx-quotes': ['error', 'prefer-double'],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'comma-dangle': ['error', 'never'],
      'array-bracket-spacing': 'error',
      '@typescript-eslint/no-unused-vars': ['off']
    }
  }
])

export default eslintConfig
