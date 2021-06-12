module.exports = {
   root: true,
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
   },
   plugins: [
      'svelte3',
      '@typescript-eslint'
   ],
   overrides: [
      {
         files: [
            '**/*.svelte'
         ],
         processor: 'svelte3/svelte3'
      }
   ],
   rules: {
      '@typescript-eslint/naming-convention': [
         'warn',
         {
            selector: 'variable',
            format: [
               'camelCase',
               'PascalCase',
               'UPPER_CASE'
            ]
         }
      ],
      '@typescript-eslint/semi': 'warn',
      'eqeqeq': 'warn',
      'no-throw-literal': 'warn',
      'eol-last': [
         'warn',
         'always'
      ],
      'indent': [
         'warn',
         3,
         {
            'SwitchCase': 1
         }
      ],
      'multiline-comment-style': [
         'warn',
         'separate-lines'
      ],
      'block-spacing': [
         'warn',
         'always'
      ],
      'no-array-constructor': 'warn',
      'no-trailing-spaces': 'warn',
      'quotes': [
         'warn',
         'single'
      ],
      'spaced-comment': [
         'warn',
         'never'
      ],
      'semi': 'off'
   },
   ignorePatterns: [
      '**/*.d.ts',
      '*.config.js'
   ],
   settings: {
      'svelte3/typescript': require('typescript'),
      'svelte3/ignore-styles': () => true
   }
};
