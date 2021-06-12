<script lang="ts">
   import { onMount, setContext } from 'svelte';
   export let vscode;
   setContext('vscode', vscode);
   onMount(() => {});
</script>

<div>Counter</div>
