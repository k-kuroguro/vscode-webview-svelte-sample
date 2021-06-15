import * as vscode from 'vscode';
import { CounterPanel } from './webview';

export function activate(context: vscode.ExtensionContext) {
   context.subscriptions.push(
      ...CounterPanel.registerCommands(context.extensionUri)
   );
}

export function deactivate() { }
