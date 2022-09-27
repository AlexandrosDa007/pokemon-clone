module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: './',
      },
      rules: {
        '@typescript-eslint/no-misused-promises': [
          "error",
          {
            "checkConditionals": false,
            "checksVoidReturn": false,
          },
        ],
        '@typescript-eslint/no-unsafe-member-access': ["warn"],
      },
    },
  ],
  extends: [
    "prettier",
  ],
  rules: {
    'import/extensions': 0,
    'no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': ["error", {"allow": [
      "arrowFunctions",
      "methods",
    ]}],
    '@typescript-eslint/ban-types': 0,
    'no-var': 'warn',
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
    "no-unused-vars": ["error", {
      "args": "none",
      "caughtErrors": "none",
      "ignoreRestSiblings": true,
      "vars": "all",
    }],
  },
};
