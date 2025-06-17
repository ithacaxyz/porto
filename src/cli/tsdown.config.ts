import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [resolve(import.meta.dirname, 'index.ts')],
  external: getExternals(),
  format: ['esm'],
  target: 'node22',
  outDir: resolve(import.meta.dirname, '../_dist/cli'),
  clean: true,
  minify: true,
  dts: false,
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
    // Add a regex pattern for the package and all its subpaths
    externals.push(
      new RegExp(`^${depName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\/.*)?$`),
    )
  }

  return externals
}
