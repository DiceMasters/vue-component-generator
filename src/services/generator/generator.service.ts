import * as vscode from 'vscode'
import { kebabize } from '../../utils/kebabize'

import {
  TComponentSyntax,
  TComponentPreprocessor,
  TComponentLang
} from '../../types'
import { IGeneratorService } from './generator.interface'

export class GeneratorController implements IGeneratorService {
  config: vscode.WorkspaceConfiguration
  name: string
  kebabName: string

  component: string
  style: string
  index: string

  _syntax: TComponentSyntax | undefined
  _preprocessor: TComponentPreprocessor | undefined
  _prefix: string
  _lang: TComponentLang | undefined
  _tagStyles: boolean | undefined

  constructor (config: vscode.WorkspaceConfiguration, name: string) {
    this.config = config
    this.name = name
    this.kebabName = kebabize(name)

    this._syntax = config.get('syntax') ?? 'composition',
    this._preprocessor = config.get('preprocessor') ?? 'scss',
    this._prefix = config.get('prefix') ?? 'c-',
    this._lang = config.get('lang') ?? 'typescript',
    this._tagStyles = config.get('styles-in-tag')

    this.style = this.generateStyleContent()
    this.index = this.generateIndexContent()
    this.component = this.generateVueContent()
  }

  generateIndexContent () {
    return `import ${this.name} from './${this.name}.vue'\n\nexport default ${this.name}`
  }

  generateStyleContent () {
    const trimmedPrefix = this._prefix.trim()
    const _p = trimmedPrefix ? `${trimmedPrefix}-` : ''
    const stylesBody = this._preprocessor === 'sass' || this._preprocessor === 'stylus' ? '\n\t' : '{\n\t\n}'

    return `.${_p + this.kebabName } ${stylesBody}`
  }

  generateVueContent () {
    const langAttr          = this._lang === 'typescript' ? 'lang="ts"' : ''
    const preprocessorAttr  = this._preprocessor === 'css' ? '' : ` lang="${this._preprocessor}"`
    const trimmedPrefix     = this._prefix.trim()
    const classPrefix       = trimmedPrefix ? `${trimmedPrefix}-` : ''

    const styleContent = this._tagStyles ? `\n${this.style}\n` : ''

    let script    = '',
        template  = `<template>\n\t<div class="${classPrefix}${ this.kebabName }"></div>\n</template>`,
        style     = `<style${preprocessorAttr} src="./style.${this._preprocessor}">${styleContent}</style>`

    if (this._syntax === 'options') {
      script = `<script${langAttr}>\nexport default {\n\t\n}\n</script>`
    } else if (this._syntax === 'vcc') {
      script = `<script ${langAttr}>\nimport { Vue, Component } from 'vue-propert-decorator'\n\n@Component\nexport default class ${this.name} extends Vue {}\n</script>`
    } else {
      // default composition
      script = `<script setup ${langAttr}>\n\n</script>`
    }

    return `${script}\n\n${template}\n\n${style}`
  }
}
