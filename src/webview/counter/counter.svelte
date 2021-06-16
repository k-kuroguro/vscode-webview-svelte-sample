<script lang="ts">
   import { onMount, setContext } from 'svelte';
   import type { WebviewApi } from 'vscode-webview';
   type State = { count: number };

   export let vscode: WebviewApi<State>;
   setContext('vscode', vscode);

   onMount(() => {});

   let count: number = vscode.getState()?.count ?? 0;

   window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.command) {
         case 'increment':
            count++;
            vscode.setState({ count });
            break;
      }
   });

   function close() {
      vscode.postMessage({ command: 'close' });
   }
</script>

<div>Counter {count}</div>
<button on:click={close}>Close</button>
