import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class CounterPanel {

   public static currentPanel?: CounterPanel;
   public static readonly viewType = 'vscode-webview-svelte-sample.counter';

   private readonly _panel: vscode.WebviewPanel;
   private readonly _extensionUri: vscode.Uri;
   private _disposables: vscode.Disposable[] = [];

   private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
      this._panel = panel;
      this._extensionUri = extensionUri;

      this._update();

      this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
      this._panel.webview.onDidReceiveMessage(
         message => {
            switch (message.command) {
               case 'close':
                  this.dispose();
                  return;
            }
         },
         undefined,
         this._disposables
      );
   }

   public dispose() {
      CounterPanel.currentPanel = undefined;

      this._panel.dispose();

      while (this._disposables.length) {
         const x = this._disposables.pop();
         if (x) x.dispose();
      }
   }

   public static createOrShow(extensionUri: vscode.Uri) {
      const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

      if (CounterPanel.currentPanel) {
         CounterPanel.currentPanel._panel.reveal(column);
         return;
      }

      const panel = vscode.window.createWebviewPanel(
         CounterPanel.viewType,
         'Counter',
         column || vscode.ViewColumn.One,
         {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')]
         }
      );

      CounterPanel.currentPanel = new CounterPanel(panel, extensionUri);
   }

   private _update() {
      this._panel.webview.html = this.getWebviewContent(this._panel.webview, this._extensionUri);
   }

   private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
      return this.replaceHtmlVars(fs.readFileSync(path.join(extensionUri.fsPath, 'dist', 'counter.html')).toString('utf-8'), webview, extensionUri.fsPath);
   }

   private replaceHtmlVars(html: string, webview: vscode.Webview, extensionPath: string): string {
      return html
         .replace(/\${webview.cspSource}/g, webview.cspSource)
         .replace(/\${webviewDistPath}/g, webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'dist'))).toString());
   }

   //#region commands

   public static registerCommands(extensionUri: vscode.Uri): vscode.Disposable[] {
      return [
         vscode.commands.registerCommand('vscode-webview-svelte-sample.counter.show', () => {
            CounterPanel.createOrShow(extensionUri);
         }),
         vscode.commands.registerCommand('vscode-webview-svelte-sample.counter.increment', () => {
            CounterPanel.increment();
         })
      ];
   }

   private static increment(): void {
      this.currentPanel?._panel.webview.postMessage({ command: 'increment' });
   }

   //#endregion

}
