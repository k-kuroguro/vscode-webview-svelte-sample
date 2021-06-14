import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

   context.subscriptions.push(
      vscode.commands.registerCommand('vscode-webview-svelte-sample.showCounter', () => {
         const panel = vscode.window.createWebviewPanel(
            'vscode-webview-svelte-sample.counter',
            'Counter',
            vscode.ViewColumn.One,
            {
               enableScripts: true,
               localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'dist'))]
            }
         );
         panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
      })
   );

   function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
      return fs.readFileSync(path.join(extensionUri.fsPath, 'dist', 'counter.html')).toString('utf-8').replace(/\${webview.cspSource}/g, webview.cspSource);
   }

}

export function deactivate() { }
