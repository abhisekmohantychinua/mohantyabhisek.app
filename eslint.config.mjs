import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angularEslint from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsdoc from 'eslint-plugin-jsdoc';

const config = defineConfig([
  {
    files: ['**/*.ts'],
    ignores: ['src/app/**/*.routes.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@angular-eslint': angularEslint,
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSort,
    },
    processor: angularTemplate.processors['extract-inline-html'],
    rules: {
      ...angularEslint.configs.recommended.rules,
      // Angular rules
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' }, // Enforce directive selectors to be attributes with 'app' prefix and camelCase style
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }, // Enforce component selectors to be elements with 'app' prefix and kebab-case style
      ],
      '@angular-eslint/no-output-on-prefix': 'error', // Enforce no output properties with 'on' prefix
      '@angular-eslint/no-input-prefix': 'error', // Enforce no input properties with 'on' prefix
      '@angular-eslint/no-empty-lifecycle-method': 'warn', // Warn on empty lifecycle methods
      '@angular-eslint/prefer-standalone': 'error', // Enforce standalone components

      // TypeScript rules
      semi: ['error', 'always'], // Enforce semicolons
      quotes: ['error', 'double', { avoidEscape: true }], // Enforce double quotes
      '@typescript-eslint/explicit-function-return-type': 'warn', // Warn on missing return types
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on use of 'any' type
      '@typescript-eslint/consistent-type-imports': 'warn', // Warn on inconsistent type imports
      '@typescript-eslint/no-empty-function': 'off', // Allow empty functions
      '@typescript-eslint/no-unused-vars': 'warn', // Warn on unused variables
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'static-field',
            'instance-field',
            'constructor',
            'instance-method',
            'private-method',
            'static-method',
          ],
        },
      ], // Warn on member ordering
      '@typescript-eslint/naming-convention': [
        'error',

        // Functions → camelCase or PascalCase (for classes used as functions)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },

        // Variables → camelCase or constants
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },

        // Variables that end with "Store" should be PascalCase
        {
          selector: 'variable',
          filter: {
            regex: 'Store$',
            match: true,
          },
          format: ['PascalCase', 'camelCase'],
        },

        // Types / Interfaces → PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Object literal properties that require quotes → no enforced format
        {
          selector: 'objectLiteralProperty',
          modifiers: ['requiresQuotes'],
          format: null,
        },
        // Properties → camelCase
        {
          selector: 'property',
          format: ['camelCase'],
        },
      ],

      // Import sorting
      'simple-import-sort/imports': 'warn', // Warn on unsorted imports
      'simple-import-sort/exports': 'error', // Error on unsorted exports
    },
  },

  ...tseslint.configs.recommended, // Base TypeScript recommended rules
  ...tseslint.configs.stylistic, // TypeScript stylistic rules
  prettierConfig, // Prettier config to disable conflicting rules
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angularTemplate.configs.accessibility.rules,
    },
  },
  {
    files: ['**/*-service.ts'], // fixed pattern
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          contexts: ['MethodDefinition[kind="method"]'],
        },
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-description': 'warn',
      'jsdoc/check-param-names': 'error',

      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },
]);

export default config;
