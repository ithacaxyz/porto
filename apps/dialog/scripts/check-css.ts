#!/usr/bin/env tsx

import * as fs from 'node:fs'
import * as path from 'node:path'

const distDir = path.join(import.meta.dirname, '../dist/dialog/assets')
const cssFiles = fs.globSync(path.join(distDir, '*.css'))

if (cssFiles.length === 0) {
  console.error('[ERROR] No CSS file found in dist/dialog/assets/.')
  process.exit(1)
}

const css = fs.readFileSync(cssFiles[0], 'utf-8')

const checks = [
  {
    name: 'File is not empty.',
    test: () => css.length > 0,
  },
  {
    name: 'Contains Tailwind selectors.',
    test: () => /\.(text-|flex|grid|bg-)/.test(css),
  },
  {
    name: 'Contains the .ui- prefix (used by @porto/ui).',
    test: () => /\.ui-/.test(css),
  },
  {
    name: 'Contains the light-dark() function and the .dark selector.',
    test: () => /light-dark\(/.test(css) && /\.dark\\:/.test(css),
  },
  {
    name: 'Contains CSS layers (properties, base, utilities).',
    test: () =>
      /@layer properties/.test(css) &&
      /@layer base/.test(css) &&
      /@layer utilities/.test(css),
  },
  {
    name: 'Contains theme variables (--color-th_*, --background-color-th_*).',
    test: () => /--color-th_/.test(css) && /--background-color-th_/.test(css),
  },
]

console.log(`Found CSS file: ${cssFiles[0]}\n`)

let failed = false
for (const { name, test } of checks) {
  if (!test()) {
    console.error(`[FAIL] ${name}`)
    failed = true
    continue
  }
  console.log(`[PASS] ${name}`)
}

if (failed) {
  console.error('\n[ERROR] CSS validation failed.')
  process.exit(1)
}

console.log('\nAll CSS checks passed.')
