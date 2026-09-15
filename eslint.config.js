import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ALL_LAYERS = ['@/app', '@/components'];

const BOUNDARY_MESSAGE = 'Import-boundary violation';
const RELATIVE_MESSAGE = 'Import-boundary violation: use the @/ alias instead of ../../';

const NO_DEEP_RELATIVE = ['../../*', '../../**'];

const boundary = (files, allowed, extraBanned = []) => {
  const banned = ALL_LAYERS.filter((name) => !allowed.includes(name)).flatMap((name) => [
    name,
    `${name}/**`,
  ]);
  return {
    files,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...(banned.length > 0 ? [{ group: banned, message: BOUNDARY_MESSAGE }] : []),
            ...(extraBanned.length > 0 ? [{ group: extraBanned, message: RELATIVE_MESSAGE }] : []),
          ],
        },
      ],
    },
  };
};

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.open-next/**',
    '.wrangler/**',
    'coverage/**',
    'playwright-report/**',
    'dist/**',
  ]),
  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.strict],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      complexity: ['error', 10],
      'max-depth': ['error', 5],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 90, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 5],
    },
  },

  boundary(['src/**/*.{ts,tsx}'], ALL_LAYERS, NO_DEEP_RELATIVE),
  boundary(['src/components/**'], ['@/components'], NO_DEEP_RELATIVE),
  boundary(
    ['src/services/**', 'src/utils/**', 'src/config/**', 'src/types/**'],
    [],
    NO_DEEP_RELATIVE,
  ),

  {
    files: ['src/components/ui/*.tsx'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },
  {
    files: ['src/tests/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
    },
  },
  {
    files: ['src/app/(catalog)/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    files: ['src/app/layout.tsx'],
    rules: {
      '@next/next/no-page-custom-font': 'off',
    },
  },
]);
