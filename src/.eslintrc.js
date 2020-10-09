module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/array-type': [
      'error',
      { default: 'array-simple', readonly: 'generic' },
    ],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { Function: 'Use a concrete function type instead' },
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: { constructors: 'no-public' },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'require-atomic-updates': 'off',
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        overrides: {
          typeLiteral: {
            multiline: {
              delimiter: 'comma',
              requireLast: true,
            },
            singleline: {
              delimiter: 'comma',
              requireLast: false,
            },
          },
        },
      },
    ],
    'no-multi-spaces': 'error',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['in', 'instanceof'],
        ],
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'function', next: '*' },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    indent: 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      { ignoreComments: true, flatTernaryExpressions: true },
    ],
    'guard-for-in': 'error',
    'new-parens': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-new-wrappers': 'error',
    'no-shadow': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error'],
    'no-useless-escape': 'off',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'quote-props': ['error', 'as-needed'],
    radix: 'error',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    eqeqeq: ['error', 'smart'],
    quotes: 'off',
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    curly: ['error', 'multi-line'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline',
      },
    ],
    'no-whitespace-before-property': 'error',
    'space-infix-ops': 'error',
    'keyword-spacing': 'error',
    'key-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-in-parens': 'error',
    'space-unary-ops': ['error', { words: true, nonwords: false }],
    'semi-spacing': 'error',
    'arrow-spacing': 'error',
    'switch-colon-spacing': 'error',
    'template-tag-spacing': 'error',
    'semi-style': 'error',
    'comma-style': 'error',
    'comma-spacing': 'error',
    'func-call-spacing': 'error',
    'generator-star-spacing': [
      'error',
      {
        before: false,
        after: true,
        anonymous: 'neither',
        method: { before: true, after: true },
      },
    ],
    'rest-spread-spacing': 'error',
    'template-curly-spacing': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'arrow-body-style': 'error',
    'arrow-parens': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    'max-len': [
      'error',
      {
        code: 80,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
  },
}