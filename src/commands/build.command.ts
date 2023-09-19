import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

import { TComponentPreprocessor } from '../types'

import { GeneratorController } from '../services/generator/generator.service'

export default async function (dir: string) {
  const config = vscode.workspace.getConfiguration('vcg'),
        configPreprocessor: TComponentPreprocessor | undefined = config.get('preprocessor'),
        configTagStyles: boolean | undefined = config.get('styles-in-tag')

  const componentTitle = await vscode.window.showInputBox({
    title: 'Генерация компонента',
    placeHolder: 'Название компонента camelCase-ом без точек и др. спецсимволов',
    ignoreFocusOut: true
  })

  if (!componentTitle && !componentTitle?.trim()) {
    vscode.window.showInformationMessage('Не указано имя компонента...')
  }

  if (componentTitle) {
    let generator: GeneratorController | undefined = new GeneratorController(config, componentTitle)
    const componentPath = path.join(dir, componentTitle)

    if (fs.existsSync(componentPath)) {
      vscode.window.showInformationMessage('Директория уже существует...')

      return
    }

    const componentDir = vscode.Uri.file(componentPath)

    try {
      vscode.workspace.fs.createDirectory(componentDir)
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/index.ts`),
        new Uint8Array(new Buffer(generator.index, 'utf-8'))
      )
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/${ componentTitle }.vue`),
        new Uint8Array(new Buffer(generator.component, 'utf-8'))
      )

      if (!configTagStyles) {
        const styleExtension = configPreprocessor === 'stylus' ? 'styl' : configPreprocessor

        vscode.workspace.fs.writeFile(
          vscode.Uri.file(`${ componentPath }/style.${styleExtension}`),
          new Uint8Array(new Buffer(generator.style, 'utf-8'))
        )
      }
    } catch (error) {
      vscode.window.showInformationMessage('Ошибка создание файлов, мб причина в правах запуска VS Code?')

      throw error
    } finally {
      generator = undefined
    }
  }
}
