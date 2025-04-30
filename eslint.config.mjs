import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import sortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order'

export default [
  js.configs.recommended,
  stylisticJs.configs['all'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery
      }
    },
    plugins: {
      'sort-keys-custom-order': sortKeysCustomOrder,
      stylisticJs
    },
    rules: {
      '@stylistic/js/array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: { minItems: 3 }
        }
      ],
      '@stylistic/js/arrow-parens': ['warn', 'as-needed'], // avoid parentheses for (a) => b.
      '@stylistic/js/dot-location': ['warn', 'property'],
      '@stylistic/js/function-call-argument-newline': ['warn', 'consistent'],
      '@stylistic/js/function-paren-newline': ['warn', 'consistent'],
      '@stylistic/js/indent': ['warn', 2, { SwitchCase: 1 }],
      '@stylistic/js/max-len': 'off',
      '@stylistic/js/multiline-comment-style': 'off',
      '@stylistic/js/newline-per-chained-call': 'off',
      '@stylistic/js/no-extra-semi': 'off', // we need them at the beginnig of .js files.
      '@stylistic/js/object-curly-spacing': ['warn', 'always'],
      '@stylistic/js/object-property-newline': [
        'warn',
        {
          allowAllPropertiesOnSameLine: true
        }
      ],
      '@stylistic/js/padded-blocks': ['warn', 'never'],
      '@stylistic/js/quote-props': ['warn', 'as-needed'],
      '@stylistic/js/quotes': [
        'warn',
        'single',
        {
          avoidEscape: true
        }
      ],
      '@stylistic/js/semi': 'off', // done by prettier
      '@stylistic/js/space-before-function-paren': [
        'warn',
        {
          anonymous: 'always',
          asyncArrow: 'never',
          named: 'never'
        }
      ],
      '@stylistic/js/wrap-iife': ['warn', 'inside'],
      'no-console': 'warn',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'sort-keys-custom-order/object-keys': 'warn'
    }
  },
  eslintPluginPrettierRecommended
]
