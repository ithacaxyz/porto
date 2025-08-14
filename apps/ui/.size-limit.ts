import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const indexFile = join(__dirname, 'src/index.ts')
const content = readFileSync(indexFile, 'utf8')

const components = content
  .split('\n')
  .map((line) => line.match(/^export \{ ([^,]+)(?:,.+)? \}/)?.[1] ?? null)
  .filter((comp) => comp && comp !== 'css')
  .sort()

module.exports = components
  .map((component) => ({
    import: `{ ${component} }`,
    name: component,
    path: './dist/index.js',
  }))
  .concat([
    {
      import: '*',
      name: 'All exports',
      path: './dist/index.js',
    },
  ])
