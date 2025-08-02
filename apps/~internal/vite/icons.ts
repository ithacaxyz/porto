import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import type { PluginOption } from 'vite'
import * as Chains from '../../../src/core/Chains.ts'

export function plugin(options: Parameters<typeof Icons>[0] = {}) {
  return [
    Icons({
      ...options,
      compiler: 'jsx',
      customCollections: {
        ...options.customCollections,
        chains: FileSystemIconLoader(path.join(dirname(), 'icons/chains')),
        porto: FileSystemIconLoader(path.join(dirname(), 'icons/porto')),
      },
      jsx: 'react',
    }),
    chainIconsPlugin(),
  ] as const satisfies PluginOption[]
}

function chainIconsPlugin(): PluginOption {
  const virtualModuleId = 'virtual:chain-icons'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    load(id) {
      if (id !== resolvedVirtualModuleId) return
      try {
        const iconsDir = path.join(dirname(), 'icons/chains')

        const chains = Object.entries(Chains)
          .map(([key, value]) => {
            if (typeof value !== 'object') return null
            return key
          })
          .filter(Boolean) as string[]

        // Generate imports
        const imports = chains
          .map((chain) => {
            const iconPath = path.join(iconsDir, `${chain}.svg`)
            const exists = fs.existsSync(iconPath)
            return `import Icon${toPascalCase(chain)} from ${exists ? `'~icons/chains/${chain}'` : `'~icons/porto/unknown'`}`
          })
          .filter(Boolean)
          .join('\n')

        // Generate map
        const map = chains
          .map((chain) => `  [Chains.${chain}.id]: Icon${toPascalCase(chain)},`)
          .join('\n')

        return `import { Chains } from 'porto'
${imports}

export const icons = {
${map}
}
`
      } catch (error) {
        console.warn('Failed to generate chain icons module:', error)
        return 'export const icons = {}'
      }
    },
    name: 'chain-icons',
    resolveId(id) {
      if (id !== virtualModuleId) return
      return resolvedVirtualModuleId
    },
  }
}

function toPascalCase(value: string) {
  return value
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function dirname() {
  if (typeof import.meta.dirname !== 'undefined') return import.meta.dirname
  return path.dirname(url.fileURLToPath(import.meta.url))
}
