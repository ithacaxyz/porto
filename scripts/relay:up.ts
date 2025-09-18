import * as fs from 'node:fs'
import * as path from 'node:path'
import * as child_process from 'node:child_process'

const updateFiles = (version: string) => [
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

const versionRegex = /v?(\d+\.\d+\.\d+)/

let version = process.argv[2]

if (!version) {
  console.log('No version provided, fetching latest from GitHub...')
  try {
    const response = await fetch(
      'https://api.github.com/repos/ithacaxyz/relay/releases/latest',
    )
    if (!response.ok)
      throw new Error(
        `Failed to fetch latest release: ${response.status} ${response.statusText}`,
      )

    const latestRelease = await response.json()
    const tagName = latestRelease.tag_name

    // Extract version from tag like "v23.0.8" -> "23.0.8"
    const match = tagName.match(versionRegex)
    if (!match) {
      console.error('Could not extract version from tag:', tagName)
      process.exit(1)
    }

    version = match[1]
  } catch (error) {
    console.error('Failed to fetch latest release from GitHub:', error)
    console.error('Please provide a version as the first argument')
    console.error('Usage: pnpm relay:up <version>')
    console.error('Example: pnpm relay:up 23.1.0')
    process.exit(1)
  }
}

const match = version?.match(versionRegex)
if (!match) {
  console.error(`Invalid version: ${version}`)
  console.error('Please provide a version in the format of x.x.x')
  process.exit(1)
}

version = match[1]

const rootDir = path.resolve(import.meta.dirname, '..')

// Update configuration files
for (const { path: relativePath, find, replace } of updateFiles(version!)) {
  const filePath = path.resolve(rootDir, relativePath)
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(find, replace)
  fs.writeFileSync(filePath, content)
}

console.log(`Successfully updated Relay to v${version}`)

console.log('\n')

// Update account submodule
try {
  console.log(`Updating \`contracts/account\` submodule for v${version}...`)

  const owner = 'ithacaxyz'
  const name = 'relay'
  const relayPath = 'tests/account'

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${name}/git/trees/v${version}?recursive=1`,
  )
  if (!response.ok)
    throw new Error(
      `Failed to fetch tree: ${response.status} ${response.statusText}`,
    )

  const data = await response.json()

  const submodule = data.tree.find(
    (item: any) => item.path === relayPath && item.type === 'commit',
  )
  if (!submodule)
    throw new Error(
      `account submodule not found in ${relayPath} at ${owner}/${name}@${version}`,
    )

  const sha = submodule.sha.slice(0, 7)

  // Update the local account submodule
  const submodulePath = path.resolve(rootDir, 'contracts/account')

  // Check if the submodule directory exists
  if (!fs.existsSync(submodulePath)) {
    console.log('Initializing submodules...')
    const { status } = child_process.spawnSync(
      'git',
      ['submodule', 'update', '--init', '--recursive'],
      {
        cwd: rootDir,
      },
    )
    if (status !== 0) throw new Error('Failed to initialize submodules')
  }

  {
    // Navigate to submodule and update to specific commit
    const { status } = child_process.spawnSync('git', ['fetch'], {
      cwd: submodulePath,
    })
    if (status !== 0) throw new Error('Failed to fetch submodule updates')
  }

  {
    // Checkout the specific commit
    const { status } = child_process.spawnSync(
      'git',
      ['checkout', submodule.sha],
      {
        cwd: submodulePath,
      },
    )
    if (status !== 0) throw new Error(`Failed to checkout commit ${sha}`)
  }

  // Ensure submodule directory is clean
  child_process.spawnSync('rm', ['-rf', 'lib'], {
    cwd: submodulePath,
  })
  child_process.spawnSync('git', ['checkout', '.'], {
    cwd: submodulePath,
  })

  {
    const { status } = child_process.spawnSync('pnpm', ['build:contracts'], {
      stdio: 'inherit',
    })
    if (status !== 0) throw new Error('Failed to build contracts')
  }

  {
    const { status } = child_process.spawnSync('pnpm', ['build:anvil-state'], {
      stdio: 'inherit',
    })
    if (status !== 0) throw new Error('Failed to build anvil state')
  }

  child_process.spawnSync('pnpm', ['check'])

  console.log(`Successfully updated \`contracts/account\` submodule to ${sha}`)
} catch (error) {
  console.error('Failed to update contracts/account submodule:', error)
  console.error('You may need to update the submodule manually.')
}
