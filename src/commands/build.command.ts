import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

import { generateIndexContent } from './../utils/indexContent'
import { generateStyleContent } from './../utils/styleContext'
import { generateVueContent }   from './../utils/vueContent'
import { TComponentSyntax, TComponentLang, TComponentPreprocessor } from '../types'

export default async function (dir: string) {
  const config = vscode.workspace.getConfiguration('vcg'),
        configSyntax: TComponentSyntax | undefined = config.get('syntax'),
        configPreprocessor: TComponentPreprocessor | undefined = config.get('preprocessor'),
        configPrefix: string | undefined = config.get('prefix'),
        configLang: TComponentLang | undefined = config.get('lang')

  const componentTitle = await vscode.window.showInputBox({
    title: 'Генерация компонента',
    placeHolder: 'Название компонента camelCase-ом без точек и др. спецсимволов',
    ignoreFocusOut: true
  })

  if (!componentTitle && !componentTitle?.trim()) {
    vscode.window.showInformationMessage('Не указано имя компонента...')
  }

  if (componentTitle) {
    const _index  = generateIndexContent(componentTitle)
    const _style  = generateStyleContent(componentTitle, configPreprocessor, configPrefix)
    const _vue    = generateVueContent(componentTitle, configSyntax, configLang, configPreprocessor, configPrefix)

    const componentPath = path.join(dir, componentTitle)

    if (fs.existsSync(componentPath)) {
      vscode.window.showInformationMessage('Директория уже существует...')

      return
    }

    const componentDir = vscode.Uri.file(componentPath)
    const styleExtension = configPreprocessor === 'stylus' ? 'styl' : configPreprocessor

    try {
      vscode.workspace.fs.createDirectory(componentDir)
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/index.ts`),
        new Uint8Array(new Buffer(_index, 'utf-8'))
      )
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/style.${styleExtension}`),
        new Uint8Array(new Buffer(_style, 'utf-8'))
      )
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/${ componentTitle }.vue`),
        new Uint8Array(new Buffer(_vue, 'utf-8'))
      )
    } catch (error) {
      vscode.window.showInformationMessage('Ошибка создание файлов, мб причина в правах запуска VS Code?')

      throw error
    }
  }
}
