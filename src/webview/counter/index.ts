import App from './counter.svelte';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../vscode.scss';

const vscode = acquireVsCodeApi();

new App({
   target: document.getElementById('app'),
   props: {
      vscode,
   }
});
