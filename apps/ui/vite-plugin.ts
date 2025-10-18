import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import type { PluginOption } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function StyledSystemAlias(options: {
  bundle: boolean
  cwd: string
}): PluginOption {
  return {
    config(_, { mode }) {
      const styledSystem = path.resolve(
        options.bundle ? __dirname : options.cwd,
        './styled-system',
      )

      if (!options.bundle && mode !== 'test' && !fs.existsSync(styledSystem))
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
  }
}

export type PortoUiOptions = {
  bundle?: boolean
}

export function PortoUi(options: PortoUiOptions = {}): PluginOption[] {
  const { bundle = false } = options
  const cwd = process.cwd()

  const plugins: PluginOption[] = [
    Icons({
      compiler: 'jsx',
      customCollections: {
        chains: FileSystemIconLoader(
          path.resolve(__dirname, './src/ChainIcon/icons'),
        ),
      },
      jsx: 'react',
    }),
    StyledSystemAlias({ bundle, cwd }),
  ]

  if (!bundle) {
    plugins.push({
      buildStart() {
        execSync('panda cssgen', { cwd, stdio: 'inherit' })
      },
      name: 'porto-ui:panda-cssgen',
    })
  }

  return plugins
}
