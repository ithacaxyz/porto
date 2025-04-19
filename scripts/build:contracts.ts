import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'

await Fs.rmdir(
  Path.resolve(
    import.meta.dirname,
    '../src/core/internal/_generated/contracts',
  ),
  { recursive: true },
)
await Fs.mkdir(
  Path.resolve(
    import.meta.dirname,
    '../src/core/internal/_generated/contracts',
  ),
  {
    recursive: true,
  },
)

async function buildContracts(outPath: string) {
  for await (const file of await Fs.readdir(outPath)) {
    const path = Path.resolve(outPath, file)
    const name = Path.basename(path, '.json')

    const { abi, bytecode } = JSON.parse(await Fs.readFile(path, 'utf-8'))

    let code = ''
    code += `export const abi = ${JSON.stringify(abi, null, 2)} as const;\n\n`
    code += `export const code = ${JSON.stringify(
      bytecode.object,
      null,
      2,
    )} as const;\n\n`

    const out = Path.resolve(
      import.meta.dirname,
      `../src/core/internal/_generated/contracts/${name}.ts`,
    )

    await Fs.appendFile(out, code)
  }
}

// Make a `DelegationOld.sol` and rewrite with old domain version.
const delegationPath_tmp = Path.resolve(
  import.meta.dirname,
  '../contracts/src/DelegationOld.sol',
)
await Fs.writeFile(
  delegationPath_tmp,
  await Fs.readFile(
    Path.resolve(import.meta.dirname, '../contracts/src/Delegation.sol'),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "0.0.1";')
      .replace('contract Delegation', 'contract DelegationOld'),
  ),
)

// Build all contracts in `accounts`.
for await (const file of Fs.glob(
  Path.resolve(import.meta.dirname, '../contracts/src/**/*.sol'),
)) {
  const name = Path.basename(file)
  const outPath = Path.resolve(import.meta.dirname, '../contracts/out/' + name)
  await buildContracts(outPath)
}

// Build EIP7702Proxy contract
await buildContracts(
  Path.resolve(import.meta.dirname, '../contracts/out/EIP7702Proxy.sol'),
)

// Remove tmp.
await Fs.rm(delegationPath_tmp)
