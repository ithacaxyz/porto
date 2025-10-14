import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import type { PluginOption } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function PortoUi(): PluginOption[] {
  return [
    Icons({
      compiler: 'jsx',
      customCollections: {
        chains: FileSystemIconLoader(
          path.resolve(__dirname, './src/ChainIcon/icons'),
        ),
      },
      jsx: 'react',
    }),
    {
      buildStart() {
        execSync('panda cssgen', { cwd: process.cwd(), stdio: 'inherit' })
      },
      name: 'porto-ui:panda-cssgen',
    },
    {
      config(_, { mode }) {
        const styledSystem = path.resolve(process.cwd(), './styled-system')

        if (mode !== 'test' && !fs.existsSync(styledSystem))
          throw new Error(
            'styled-system/ not found. Generate it with: pnpm panda codegen',
          )

        return {
          resolve: {
            alias: {
              'styled-system': styledSystem,
            },
          },
        }
      },
      name: 'porto-ui:alias',
    },
  ]
}
