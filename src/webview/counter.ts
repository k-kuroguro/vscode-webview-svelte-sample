import App from './counter.svelte';
import './vscode.scss';

const vscode = acquireVsCodeApi();

new App({
   target: document.getElementById('app'),
   props: {
      vscode,
   }
});
