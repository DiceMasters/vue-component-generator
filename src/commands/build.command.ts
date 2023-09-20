import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

import { TComponentPreprocessor } from '../types'

import { GeneratorService } from '../services/generator/generator.service'
import { prefixParse } from '../utils/prefixParse'

export default async function (dir: string) {
  const config = vscode.workspace.getConfiguration('vcg'),
        configPrefix: string = config.get('prefix') ?? 'c',
        configPreprocessor: TComponentPreprocessor | undefined = config.get('preprocessor'),
        configTagStyles: boolean | undefined = config.get('styles-in-tag')

  const componentTitle = await vscode.window.showInputBox({
    title: 'Генерация компонента',
    placeHolder: 'Название компонента camelCase-ом без точек и др. спецсимволов',
    ignoreFocusOut: true
  })

  if (!componentTitle && !componentTitle?.trim()) {
    vscode.window.showErrorMessage('Не указано имя компонента...')
  }

  if (componentTitle) {
    const parser = prefixParse(configPrefix, componentTitle)

    if (parser instanceof Error) {
      vscode.window.showErrorMessage(parser.message)

      return
    }

    const componentPath = path.join(dir, parser.componentName)

    let generatorService: GeneratorService | undefined = new GeneratorService(config, parser.componentName, parser.prefix)

    if (fs.existsSync(componentPath)) {
      vscode.window.showErrorMessage('Директория уже существует...')

      return
    }

    const componentDir = vscode.Uri.file(componentPath)

    try {
      vscode.workspace.fs.createDirectory(componentDir)
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/index.ts`),
        new Uint8Array(new Buffer(generatorService.index, 'utf-8'))
      )
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${ componentPath }/${ parser.componentName }.vue`),
        new Uint8Array(new Buffer(generatorService.component, 'utf-8'))
      )

      if (!configTagStyles) {
        const styleExtension = configPreprocessor === 'stylus' ? 'styl' : configPreprocessor

        vscode.workspace.fs.writeFile(
          vscode.Uri.file(`${ componentPath }/style.${styleExtension}`),
          new Uint8Array(new Buffer(generatorService.style, 'utf-8'))
        )
      }
    } catch (error) {
      vscode.window.showErrorMessage('Ошибка создание файлов, мб причина в правах запуска VS Code?')

      throw error
    } finally {
      generatorService = undefined
    }
  }
}
