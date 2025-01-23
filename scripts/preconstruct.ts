import * as fs from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { getExports } from './utils/exports.js'

// biome-ignore lint/suspicious/noConsoleLog:
console.log('Setting up packages for development.')

import { fileURLToPath } from 'node:url';

const packagePath = resolve(fileURLToPath(import.meta.url), '../src/package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))

// biome-ignore lint/suspicious/noConsoleLog:
console.log(`${packageJson.name} — ${dirname(packagePath)}`)

const dir = resolve(dirname(packagePath))

// Empty dist directories
fs.rmSync(resolve(dir, '_dist'), { recursive: true, force: true })

const exports = getExports()

// Link exports to dist locations
for (const [key, distExports] of Object.entries(exports.dist ?? {})) {
  // Skip `package.json` exports
  if (/package\.json$/.test(key)) continue

  let entries: any
  if (typeof distExports === 'string')
    entries = [
      ['default', distExports],
      ['types', distExports.replace('.js', '.d.ts')],
    ]
  else entries = Object.entries(distExports as {})

  // Link exports to dist locations
  for (const [, value] of entries as [
    type: 'types' | 'default',
    value: string,
  ][]) {
    const srcFilePath = resolve(dir, exports.src[key]!)

    const distDir = resolve(dir, dirname(value))
    const distFileName = basename(value)
    const distFilePath = resolve(distDir, distFileName)

    fs.mkdirSync(distDir, { recursive: true })

    // Symlink src to dist file
    try {
      fs.symlinkSync(srcFilePath, distFilePath, 'file')
    } catch {}
  }
}

// biome-ignore lint/suspicious/noConsoleLog:
console.log('Done.')
