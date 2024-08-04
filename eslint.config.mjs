import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  stylisticJs.configs['all-flat'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery
      }
    },
    plugins: {
      stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/max-len': 'off',
      '@stylistic/js/array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: { minItems: 3 }
        }
      ],
      '@stylistic/js/function-call-argument-newline': ['warn', 'consistent'],
      '@stylistic/js/padded-blocks': ['warn', 'never'],
      '@stylistic/js/space-before-function-paren': [
        'warn',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'never'
        }
      ],
      '@stylistic/js/quote-props': ['warn', 'as-needed'],
      '@stylistic/js/object-property-newline': [
        'warn',
        {
          allowAllPropertiesOnSameLine: true
        }
      ],
      '@stylistic/js/object-curly-spacing': ['warn', 'always'],
      '@stylistic/js/wrap-iife': ['warn', 'inside'],
      '@stylistic/js/newline-per-chained-call': 'off',
      '@stylistic/js/quotes': [
        'warn',
        'single',
        {
          avoidEscape: true
        }
      ],
      '@stylistic/js/multiline-comment-style': 'off',
      '@stylistic/js/semi': 'off', // done by prettier
      '@stylistic/js/no-extra-semi': 'off', // we need them at the beginnig of .js files.
      '@stylistic/js/arrow-parens': 'as-needed' // avoid parentheses for (a) => b.
    }
  },
  eslintConfigPrettier
]
