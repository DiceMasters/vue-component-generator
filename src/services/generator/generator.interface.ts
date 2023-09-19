import * as vscode from 'vscode'

import {
  TComponentSyntax,
  TComponentPreprocessor,
  TComponentLang
} from '../../types'

export interface IGeneratorService {
  config: vscode.WorkspaceConfiguration
  name: string
  kebabName: string

  component: string
  style: string
  index: string

  _syntax: TComponentSyntax | undefined
  _preprocessor: TComponentPreprocessor | undefined
  _prefix: string | undefined
  _lang: TComponentLang | undefined
  _tagStyles: boolean | undefined

  generateIndexContent: () => string
  generateStyleContent: () => string
  generateVueContent: () => string
}
