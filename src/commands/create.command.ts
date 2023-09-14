import * as vscode from 'vscode'
import * as fs from 'fs'

export default async function (ctx: any) {
  const parsed = (ctx.path as string).substring(1)
  const isExist = fs.existsSync(parsed)

  if (!isExist) {
    vscode.window.showInformationMessage('Выбранная директория не существует...')

    return
  }

  vscode.window.showInformationMessage('Работаем дальше')
  vscode.commands.executeCommand('vue-component-generator.build', parsed)
}
