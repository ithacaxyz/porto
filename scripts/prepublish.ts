import * as fs from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { getExports } from './utils/exports.js'

const packageJsonPath = join(import.meta.dirname, '../src/package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

const exports = getExports({
  onEntry: ({ entryName, name, parentEntryName }) => {
    const modulePath = (dist?: string) => {
      let path = './'
      if (dist) path += `${dist}/`
      if (dist || (parentEntryName && parentEntryName !== 'core'))
        path += `${parentEntryName}/`
      if (dist || name !== 'index') path += name
      return path
    }

    try {
      fs.mkdirSync(resolve(import.meta.dirname, '../src', entryName))
    } catch {}
    fs.writeFileSync(
      resolve(import.meta.dirname, '../src', entryName, 'package.json'),
      JSON.stringify(
        {
          main: relative(modulePath(), modulePath('_dist')) + '.js',
          type: 'module',
          types: relative(modulePath(), modulePath('_dist')) + '.d.ts',
        },
        null,
        2,
      ),
    )
  },
})

packageJson.exports = exports.dist
packageJson.bin = { porto: './_dist/cli/bin/index.js' }

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
