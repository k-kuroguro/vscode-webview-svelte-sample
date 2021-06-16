import * as vscode from 'vscode';
import { Webview } from './webview';

export function activate(context: vscode.ExtensionContext) {
   context.subscriptions.push(
      new Webview(context.extensionUri)
   );
}

export function deactivate() { }
