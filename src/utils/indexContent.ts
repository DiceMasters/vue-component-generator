export function generateIndexContent (componentName: string) {
  return `import ${componentName} from './${componentName}.vue'\n\nexport default ${componentName}`
}
