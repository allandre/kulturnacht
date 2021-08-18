module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'html',
  ],
  settings: {
    'html/indent': '+4',
    'html/html-extensions': ['.html'],
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
  overrides: [
    {
      files: '**/*.html',
      rules: {
        indent: ['error', 4],
      },
    },
  ],
};
