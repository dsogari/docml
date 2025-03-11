import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import cspell from '@cspell/eslint-plugin/configs';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  jsdoc.configs['flat/recommended-typescript-error'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'jsdoc/no-undefined-types': 'error',
    },
  },
  {
    ...cspell.recommended,
    rules: {
      ...cspell.recommended.rules,
      '@cspell/spellchecker': 'error',
    },
  },
  {
    ignores: ['**/dist', '**/out'],
  },
);
