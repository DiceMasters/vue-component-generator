import { kebabize } from './kebabize'
import { TComponentSyntax, TComponentLang, TComponentPreprocessor } from './../types'

// TODO: Убрать повторения, говнокод

export function generateVueContent (
  componentName: string,
  syntax: TComponentSyntax = 'composition',
  lang: TComponentLang = 'typescript',
  preprocessor: TComponentPreprocessor = 'scss',
  prefix: string = 'c'
) {
  switch (syntax) {
    case 'composition':
      return composition(componentName, lang, preprocessor, prefix)

    case 'options':
      return options(componentName, lang, preprocessor, prefix)

    case 'vcc':
      return vcc(componentName, lang, preprocessor, prefix)

    default:
      return composition(componentName, lang, preprocessor, prefix)
  }
}

function composition (componentName: string, lang: TComponentLang, preprocessor: TComponentPreprocessor, prefix: string) {
  const langAttr = lang === 'typescript' ? 'lang="ts"' : ''
  const preprocessorAttr = preprocessor === 'css' ? '' : ` lang="${preprocessor}"`
  const trimmedPrefix = prefix.trim()
  const classPrefix = trimmedPrefix ? `${trimmedPrefix}-` : ''

  const script = `<script setup ${langAttr}>\n\t\n</script>`
  const template = `<template>\n\t<div class="${classPrefix}${ kebabize(componentName) }"></div>\n</template>`
  const style = `<style${preprocessorAttr} src="./style.${preprocessor}"></style>`

  return `${script}\n\n${template}\n\n${style}`
}

function options (componentName: string, lang: TComponentLang, preprocessor: TComponentPreprocessor, prefix: string) {
  const langAttr = lang === 'typescript' ? ' lang="ts"' : ''
  const preprocessorAttr = preprocessor === 'css' ? '' : ` lang="${preprocessor}"`
  const trimmedPrefix = prefix.trim()
  const classPrefix = trimmedPrefix ? `${trimmedPrefix}-` : ''

  const script = `<script${langAttr}>\n\texport default {\n\t\t\n}\n</script>`
  const template = `<template>\n\t<div class="${classPrefix}${ kebabize(componentName) }"></div>\n</template>`
  const style = `<style${preprocessorAttr} src="./style.${preprocessor}"></style>`

  return `${script}\n\n${template}\n\n${style}`
}

function vcc (componentName: string, lang: TComponentLang, preprocessor: TComponentPreprocessor, prefix: string) {
  const langAttr = lang === 'typescript' ? 'lang="ts"' : ''
  const preprocessorAttr = preprocessor === 'css' ? '' : ` lang="${preprocessor}"`
  const trimmedPrefix = prefix.trim()
  const classPrefix = trimmedPrefix ? `${trimmedPrefix}-` : ''

  const script = `<script ${langAttr}>\n\timport { Vue, Component } from 'vue-propert-decorator'\n\n@Component\nexport default class ${componentName} extends Vue {}\n</script>`
  const template = `<template>\n\t<div class="${classPrefix}${ kebabize(componentName) }"></div>\n</template>`
  const style = `<style${preprocessorAttr} src="./style.${preprocessor}"></style>`

  return `${script}\n\n${template}\n\n${style}`
}
