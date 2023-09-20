export function prefixParse (
  prefix: string,
  promptComponentString: string
  ): {
    prefix: string,
    componentName: string
  } | Error {
  const match = promptComponentString.match(/^.+:/g)

  if (match?.length) {
    const prefixLength = match[0].length
    const prefix = match[0].substring(0, prefixLength - 1)
    const componentName = promptComponentString.replace(match[0], '')

    if (prefix.match(/\W/g)) {
      return Error('Префикс содержит спецсимволы')
    }

    return {
      prefix,
      componentName
    }
  }

  return {
    prefix,
    componentName: promptComponentString
  }
}
