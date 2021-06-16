<script lang="ts">
   import { onMount, setContext } from 'svelte';
   export let vscode;
   setContext('vscode', vscode);

   onMount(() => {});

   let count: number = 0;

   window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.command) {
         case 'increment':
            count++;
            break;
      }
   });

   function close() {
      vscode.postMessage({ command: 'close' });
   }
</script>

<div>Counter {count}</div>
<button on:click={close}>Close</button>
