import App from './counter.svelte';

const vscode = acquireVsCodeApi();

new App({
   target: document.getElementById('app'),
   props: {
      vscode,
   }
});
