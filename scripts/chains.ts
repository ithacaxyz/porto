import { http, createClient } from 'viem'
import { getCapabilities } from 'viem/actions'
import { readFile, writeFile } from 'node:fs/promises'
import * as Chains from 'viem/chains'

// TODO: Update wagmi.config.ts
console.log('Fetching chains for environments.')

const environments = [
  {
    name: 'prod',
    rpc: 'https://rpc.ithaca.xyz',
    // Record<viemChainName, rpcUrl>
    // e.g. { base: 'https://rpc.example.com' }
    transportOverrides: {},
  },
  { name: 'stg', rpc: 'https://stg-rpc.ithaca.xyz', transportOverrides: {} },
] as const

const configPath = './apps/~internal/lib/PortoConfig.ts'
const chainsSet = new Set<string>([])
for (const environment of environments) {
  console.log(`\n${environment.name} — ${environment.rpc}`)

  const client = createClient({
    transport: http(environment.rpc),
  })

  const capabilities = await getCapabilities(client)
  const supportedChainIds = Object.keys(capabilities).map(Number)

  const allChains = Object.entries(Chains)
  let supportedChains: string[] = []
  for (const chainId of supportedChainIds) {
    const entry = allChains.find(([, chain]) => chain.id === chainId)
    if (!entry) throw new Error(`No chain found for id ${chainId}`)
    const slug = entry[0]
    supportedChains.push(slug)
    chainsSet.add(slug)
  }
  supportedChains = supportedChains.toSorted()

  console.log(
    `Found ${supportedChains.length} chains\n${supportedChains.map((v, i) => `${i + 1}. ${v}`).join('\n')}`,
  )

  console.log(`Updating ${configPath}`)
  const file = await readFile(configPath, 'utf8')
  let content = replaceChainsByEnvironment(
    file,
    environment.name,
    supportedChains,
  )
  content = replaceTransportsByEnvironment(
    file,
    environment.name,
    supportedChains,
    environment.transportOverrides,
  )
  await writeFile(configPath, content)

  if (environment.name === 'prod') {
    const chainsPath = './src/core/Chains.ts'
    console.log(`Updating ${chainsPath}`)
    const file = await readFile(chainsPath, 'utf8')
    const content = replaceChainsForViemChainsExport(file, [
      'anvil',
      ...supportedChains,
    ])
    await writeFile(chainsPath, content)
  }
}

console.log(`\nUpdating imports ${configPath}`)
const file = await readFile(configPath, 'utf8')
const content = replaceChainsForViemChainsImport(
  file,
  [...chainsSet.values()].toSorted(),
)
await writeFile(configPath, content)

console.log('\nDone.')

////////////////////////////////////////////////////////////////////////////////////

function replaceChainsByEnvironment(
  content: string,
  environment: 'prod' | 'stg',
  newChains: string[],
) {
  const pattern = new RegExp(
    `(\\b${environment}\\s*:\\s*\\{[^}]*?chains:\\s*\\[)[\\s\\S]*?(\\][^}]*?\\})`,
    'g',
  )

  return content.replace(pattern, (_match, start, end) => {
    const baseIndent = '    '
    const chainIndent = '      '
    const chainsList = newChains
      .map((chain) => `${chainIndent}${chain},`)
      .join('\n')
    return `${start}\n${chainsList}\n${baseIndent}${end}`
  })
}

function replaceTransportsByEnvironment(
  content: string,
  environment: 'prod' | 'stg',
  newChains: string[],
  transportOverrides: Record<string, string>,
): string {
  const pattern = new RegExp(
    `(${environment}:\\s*\\{[\\s\\S]*?transports:\\s*\\{)[\\s\\S]*?(\\}[\\s\\S]*?\\})`,
    'g',
  )

  return content.replace(pattern, (_match, start, end) => {
    const baseIndent = '      '
    const transportsList = newChains
      .map((chain) => {
        const chainId = `${chain}.id`
        const rpcUrl = transportOverrides[chain]
        const transport = rpcUrl
          ? `http('${rpcUrl}', Sentry.httpTransportOptions())`
          : 'http(undefined, Sentry.httpTransportOptions())'
        return `${baseIndent}[${chainId}]: ${transport},`
      })
      .join('\n')
    return `${start}\n${transportsList}\n    ${end}`
  })
}

function replaceChainsForViemChainsImport(
  content: string,
  newChains: string[],
) {
  const pattern = /import\s*\{[^}]*\}\s*from\s+['"]viem\/chains['"]/g

  return content.replace(pattern, () => {
    const indent = '  '
    const chainsList = newChains.map((chain) => `${indent}${chain}`).join(',\n')
    return `import {\n${chainsList},\n} from 'viem/chains'`
  })
}

function replaceChainsForViemChainsExport(
  content: string,
  newChains: string[],
) {
  const pattern = /export\s*\{[^}]*\}\s*from\s+['"]viem\/chains['"]/g

  return content.replace(pattern, () => {
    const indent = '  '
    const chainsList = newChains.map((chain) => `${indent}${chain}`).join(',\n')
    return `export {\n${chainsList},\n} from 'viem/chains'`
  })
}
