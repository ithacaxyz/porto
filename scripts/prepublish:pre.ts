import * as fs from 'node:fs'
import * as path from 'node:path'

console.info('prepublish:pre')

const packageJsonPath = path.join(process.cwd(), 'package.json')

fs.copyFileSync(packageJsonPath, packageJsonPath.replace('.json', '.tmp.json'))

// Read package.json as text to find the marker position
const content = fs.readFileSync(packageJsonPath, 'utf-8')
const data = JSON.parse(content)

// Find all keys that appear before "[!start-pkg]" in the file
const keys = Object.keys(data)
const markerIndex = keys.indexOf('[!start-pkg]')

// Remove all keys up to and including the marker
const keysToRemove = keys.slice(0, markerIndex + 1)
for (const key of keysToRemove) {
  delete data[key]
}

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf-8')

console.log('✓ Trimmed package.json')
