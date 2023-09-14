import { kebabize } from './kebabize'
import { TComponentPreprocessor } from '../types'

export function generateStyleContent (componentName: string, preprocessor: TComponentPreprocessor = 'scss', prefix: string = 'c') {
  const trimmedPrefix = prefix.trim()
  const _p = trimmedPrefix ? `${trimmedPrefix}-` : ''

  if (preprocessor === 'sass' || preprocessor === 'stylus') {
    return `.${ _p + kebabize(componentName) } \n\t\n`
  }

  return `.c-${_p + kebabize(componentName) } {\n\t\n}`
}
