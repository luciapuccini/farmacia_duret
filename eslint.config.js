import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // ESLint does not read .gitignore, and supplying our own ignores replaces the
  // defaults that ship inside eslint-config-next, so Next's entries are restated here.
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
    // Next's TypeScript tier is `recommended` only. The repo already passes `strict`,
    // so it is layered back on top rather than dropped.
    extends: [tseslint.configs.strict],
    rules: {
      // jsx-a11y is spread RULES-ONLY, on purpose. eslint-config-next already registers
      // the `jsx-a11y` plugin namespace, so spreading `jsxA11y.flatConfigs.recommended`
      // whole throws `Cannot redefine plugin "jsx-a11y"` and no lint run starts at all.
      // Do not "clean this up" into a normal config spread.
      // Next enables only 6 jsx-a11y rules and only as warnings; recommended's full set
      // lands here as errors, which is the a11y floor this public site is held to.
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // Generated shadcn primitives, depth-1 only. The hand-written components live one
  // level deeper at src/components/ui/<name>/<name>.tsx and stay fully covered.
  {
    files: ['src/components/ui/*.tsx'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  },

  // Test files are allowed to be long; a table-driven suite in one function is fine.
  {
    files: ['src/tests/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
    },
  },

  // Product imagery is external URLs. next/image would need `remotePatterns` plus a
  // Workers-compatible loader, which is separate work.
  {
    files: ['src/app/(catalog)/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },

  // Pages-Router-shaped rule: its own message cites `pages/_document.js`. In the App
  // Router the root layout IS the global location, so the font link here does apply to
  // every page. Scoped to this one file so a font <link> added inside a route later —
  // a genuine per-page custom font — is still flagged.
  {
    files: ['src/app/layout.tsx'],
    rules: {
      '@next/next/no-page-custom-font': 'off',
    },
  },
]);
