module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'lodash', 'prettier', 'import'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  globals: {
    __DEV__: true,
  },

  rules: {
    'prettier/prettier': 'error',
    'lodash/import-scope': [2, 'method'],
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // waiting for https://github.com/typescript-eslint/typescript-eslint/issues/50
    '@typescript-eslint/explicit-function-return-type': 'off',

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '_+',
      },
    ],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
      },
    ],
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/newline-after-import': 'error',
    'import/no-mutable-exports': 'warn',
    'import/export': 'warn',
    'import/no-useless-path-segments': 'error',
    'import/no-self-import': 'error',
    'import/no-absolute-path': 'error',
  },
}
