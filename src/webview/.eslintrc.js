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
   rules: {},
   settings: {
      'svelte3/typescript': require('typescript'),
      'svelte3/ignore-styles': () => true
   }
};
