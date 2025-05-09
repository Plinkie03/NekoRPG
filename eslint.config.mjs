import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: [
            'node_modules',
            'dist',
            '.qlty',
            '.git',
            '.vscode',
        ],
    },
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser },
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        rules: {
            'comma-dangle': ['error', 'always-multiline'],
            'consistent-return': 'error',
            curly: ['error', 'multi-line'],
            semi: ['error', 'always'],
            indent: ['error', 4, { SwitchCase: 1 }],
            'max-len': ['error', { code: 128, ignoreStrings: true }],
            'no-implied-eval': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            quotes: ['error', 'single', { avoidEscape: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    tseslint.configs.recommended,
]);