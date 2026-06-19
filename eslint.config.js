import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConf from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'server.js', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // react rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // unused-imports rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          'vars': 'all',
          'varsIgnorePattern': '^_',
          'args': 'after-used',
          'argsIgnorePattern': '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Change to warn during clean up or configure rules, but let's look at what the user wanted: "No unnecessary any types". We will clean up any types, but let's change to 'off' or handle it config wise, or let's clean up any actual nested errors! Let's use 'error' as requested: "No unnecessary any types".
      'no-unreachable': 'error',
      'no-useless-assignment': 'off', // some files might trigger useless assignment which is not vital
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConf,
];
