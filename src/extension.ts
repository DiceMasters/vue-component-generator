import * as vscode from 'vscode'
import commands from './commands'

export function activate (context: vscode.ExtensionContext) {
  vscode.commands.registerCommand(`vue-component-generator.create`, commands.create)
  vscode.commands.registerCommand(`vue-component-generator.build`, commands.build)
}

// This method is called when your extension is deactivated
export function deactivate () {}
