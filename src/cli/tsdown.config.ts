import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: false,
  dts: false,
  entry: [resolve(import.meta.dirname, 'bin/index.ts')],
  external: getExternals(),
  format: ['esm'],
  minify: true,
  outDir: resolve(import.meta.dirname, '../_dist/cli/bin'),
  target: 'node20',
})

////////////////////////////////////////////////////////////////////////
// Utilities

function getExternals() {
  const pkgJson = JSON.parse(
    readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf-8'),
  )

  const externals: (string | RegExp)[] = []
  const dependencies = pkgJson.dependencies || {}

  for (const [depName] of Object.entries(dependencies)) {
    if (depName === 'ox') continue

    // Add a regex pattern for the package and all its subpaths
    externals.push(
      new RegExp(`^${depName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\/.*)?$`),
    )
  }

  return externals
}
