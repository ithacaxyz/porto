// TODO:
// - Get latest version from https://github.com/ithacaxyz/relay/releases
// - Ensure account/contract submodules are up to date

import * as fs from 'node:fs'
import * as path from 'node:path'
import { createClient, http } from 'viem'
import * as RelayActions from '../src/viem/RelayActions.js'

const files = (version: string) => [
  {
    path: 'compose.yaml',
    find: /FROM ghcr\.io\/ithacaxyz\/relay:v[\d.]+/,
    replace: `FROM ghcr.io/ithacaxyz/relay:v${version}`,
  },
  {
    path: 'apps/playground/vite.config.ts',
    find: /version: 'v[\d.]+'/,
    replace: `version: 'v${version}'`,
  },
  {
    path: 'test/src/relay.ts',
    find: /version: 'v[\d.]+'/,
    replace: `version: 'v${version}'`,
  },
]
const relayUrl = 'https://rpc.ithaca.xyz'

// Get the version from CLI args or fetch from RelayActions.health
let version = process.argv[2]

if (!version) {
  console.log(`No version provided, fetching latest from ${relayUrl}...\n`)
  try {
    // Create a client to connect to the relay
    const client = createClient({
      transport: http(relayUrl),
    })

    const health = await RelayActions.health(client)

    // Extract version from response like "23.0.8-dev (54a851c)" -> "23.0.8"
    const match = health.version.match(/v?(\d+\.\d+\.\d+)/)
    if (!match) {
      console.error(
        'Could not extract version from health response:',
        health.version,
      )
      process.exit(1)
    }

    version = match[1]
  } catch (error) {
    console.error(`❌ Failed to fetch version from ${relayUrl}:`, error)
    console.error('Please provide a version as the first argument')
    console.error('Usage: pnpm relay:up <version>')
    console.error('Example: pnpm relay:up 23.1.0')
    process.exit(1)
  }
}

const rootDir = path.resolve(import.meta.dirname, '..')
for (const { path: relativePath, find, replace } of files(version!)) {
  const filePath = path.resolve(rootDir, relativePath)
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(find, replace)
  fs.writeFileSync(filePath, content)
}

console.log(`Successfully updated Relay to ${version}`)
