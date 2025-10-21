import * as fs from 'node:fs'
import * as path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(rootDir, 'src')
const packageJsonPath = path.join(rootDir, 'package.json')

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

// Generate exports
const exports: Record<string, string> = {
  '.': './src/index.ts',
}

// Read src directory
const entries = fs.readdirSync(srcDir, { withFileTypes: true })

for (const entry of entries) {
  // Skip non-directories and special directories
  if (!entry.isDirectory()) {
    // Handle top-level .ts files (excluding index.ts)
    if (entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      const name = entry.name.replace(/\.ts$/, '')
      exports[`./${name}`] = `./src/${entry.name}`
    }
    continue
  }

  // Skip node_modules
  if (entry.name === 'node_modules') continue

  const dirPath = path.join(srcDir, entry.name)
  const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true })

  // Check if directory has index.ts
  const hasIndex = dirEntries.some((e) => e.name === 'index.ts' && e.isFile())

  if (hasIndex)
    // Add directory-level export
    exports[`./${entry.name}`] = `./src/${entry.name}/index.ts`

  // Add second-level files (excluding index.ts)
  for (const subEntry of dirEntries) {
    if (
      subEntry.isFile() &&
      subEntry.name !== 'index.ts' &&
      !subEntry.name.endsWith('.test.ts') &&
      !subEntry.name.endsWith('.bench.ts') &&
      !subEntry.name.endsWith('.config.ts')
    ) {
      const name = subEntry.name.replace(/\.ts$/, '')
      exports[`./${entry.name}/${name}`] =
        `./src/${entry.name}/${subEntry.name}`
    }
  }
}

packageJson.exports = exports

// Write package.json back
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + '\n',
  'utf-8',
)

console.log('✓ Updated exports in package.json')
console.log(`  Generated ${Object.keys(exports).length} export entries`)
