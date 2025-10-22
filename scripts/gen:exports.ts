import * as fs from 'node:fs'
import * as path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(rootDir, 'src')
const packageJsonPath = path.join(rootDir, 'package.json')

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

const exportMap = new Map<
  string,
  {
    src?: string
    types?: string
    default?: string
    conditions: Record<string, string>
  }
>()
const exportOrder: string[] = []

const skipFile = (file: string) =>
  /(\.test|\.bench|\.config)\.(t|j)sx?$/i.test(file)

const toPosix = (value: string) => value.split(path.sep).join('/')

const ensureEntry = (key: string) => {
  let entry = exportMap.get(key)
  if (!entry) {
    entry = { conditions: {} }
    exportMap.set(key, entry)
    exportOrder.push(key)
  }
  return entry
}

const registerFile = (relativePath: string) => {
  const posixPath = toPosix(relativePath)
  if (skipFile(posixPath)) return

  const ext = path.extname(posixPath).toLowerCase()
  if (ext !== '.ts' && ext !== '.tsx') return

  const dirName = path.dirname(posixPath)
  let baseName = path.basename(posixPath, ext)

  let isNative = false
  if (baseName.endsWith('.native')) {
    isNative = true
    baseName = baseName.slice(0, -'.native'.length)
  }

  const normalizedDir = dirName === '.' ? '' : dirName
  const key =
    baseName === 'index'
      ? normalizedDir
        ? `./${normalizedDir}`
        : '.'
      : normalizedDir
        ? `./${normalizedDir}/${baseName}`
        : `./${baseName}`

  const entry = ensureEntry(key)

  const srcPath = `./src/${posixPath}`
  const distPath = `./dist/${posixPath.replace(/\.(tsx?|jsx?)$/, '.js')}`
  const typesPath = `./dist/${posixPath.replace(/\.(tsx?|jsx?)$/, '.d.ts')}`

  if (isNative) {
    entry.conditions['react-native'] = distPath
    entry.conditions.browser = distPath.replace('.native', '')
    if (!entry.src) entry.src = srcPath
    if (!entry.types) entry.types = typesPath
    if (!entry.default) entry.default = distPath
  } else {
    entry.src = srcPath
    entry.types = typesPath
    entry.default = distPath
  }
}

ensureEntry('.')

const entries = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))

for (const entry of entries) {
  if (entry.isFile()) {
    registerFile(entry.name)
    continue
  }

  if (!entry.isDirectory() || entry.name === 'node_modules') continue

  const dirPath = path.join(srcDir, entry.name)
  const dirEntries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((subEntry) => subEntry.isFile())
    .sort((a, b) => a.name.localeCompare(b.name))

  const indexEntry = dirEntries.find(
    (subEntry) => subEntry.name === 'index.ts' || subEntry.name === 'index.tsx',
  )

  if (indexEntry) registerFile(path.join(entry.name, indexEntry.name))

  for (const subEntry of dirEntries.filter(
    (subEntry) => subEntry !== indexEntry,
  ))
    registerFile(path.join(entry.name, subEntry.name))
}

const exports: Record<string, Record<string, string>> = {}
for (const key of exportOrder) {
  const value = exportMap.get(key)
  if (!value) continue
  const entry: Record<string, string> = {}

  if (value.src) entry.src = value.src
  if (value.types) entry.types = value.types

  for (const [condition, conditionValue] of Object.entries(
    value.conditions ?? {},
  )) {
    entry[condition] = conditionValue
  }

  if (value.default) entry.default = value.default

  exports[key] = entry
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
