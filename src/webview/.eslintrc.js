module.exports = {
   plugins: [
      'svelte3'
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
      '@typescript-eslint/consistent-type-imports': [
         'error',
         {
            prefer: 'type-imports'
         },
      ]
   },
   settings: {
      'svelte3/typescript': require('typescript'),
      'svelte3/ignore-styles': () => true
   }
};
