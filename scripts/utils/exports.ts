import * as fs from 'node:fs'
import { matchesGlob, resolve } from 'node:path'

const exclude = [
  '_dist',
  'node_modules',
  'jsr.json',
  'tsdoc.json',
  'version.ts',
]

export function getExports({
  onEntry,
}: {
  onEntry?: (entry: {
    entryName: string
    name: string
    parentEntryName?: string | undefined
  }) => void
} = {}) {
  const dist = {} as Record<string, string | { types: string; default: string }>
  const src = {} as Record<string, string>

  const entries = fs
    .readdirSync(resolve(import.meta.dirname, '../../src'), {
      withFileTypes: true,
    })
    .filter((entry) => !exclude.some((x) => matchesGlob(entry.name, x)))

  for (const parentEntry of entries) {
    if (!parentEntry.isDirectory()) {
      if (parentEntry.name.endsWith('test.ts')) continue
      if (
        !parentEntry.name.endsWith('.ts') &&
        !parentEntry.name.endsWith('.json')
      )
        continue

      const name = parentEntry.name.replace(/\.ts$/, '')
      const entryName = `.${name === 'index' ? '' : `/${name}`}`

      if (!parentEntry.name.endsWith('.ts')) {
        dist[entryName] = entryName
        src[entryName] = entryName
      } else {
        dist[entryName] = {
          types: `./_dist/${name}.d.ts`,
          default: `./_dist/${name}.js`,
        }
        src[entryName] = `./${name}.ts`

        if (name === 'index') continue

        onEntry?.({ entryName, name })
      }

      continue
    }

    const entries = fs.readdirSync(
      resolve(parentEntry.parentPath, parentEntry.name),
      {
        withFileTypes: true,
      },
    )
    for (const entry of entries) {
      if (entry.name.endsWith('test.ts')) continue
      if (entry.isDirectory()) continue

      const isIndex = entry.name === 'index.ts'
      const name = entry.name.replace(/\.ts$/, '')

      if (!/^[A-Z]/.test(name) && name !== 'index') continue

      const entryName = `.${parentEntry.name === 'core' ? '' : `/${parentEntry.name}`}${isIndex ? '' : `/${name}`}`

      dist[entryName] = {
        types: `./_dist/${parentEntry.name}/${name}.d.ts`,
        default: `./_dist/${parentEntry.name}/${name}.js`,
      }
      src[entryName] = `./${parentEntry.name}/${name}.ts`

      if (entryName !== '.')
        onEntry?.({ entryName, name, parentEntryName: parentEntry.name })
    }
  }

  return { dist, src }
}
