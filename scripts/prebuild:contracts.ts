import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'

// Make a `DelegationOld.sol` and rewrite with old domain version.
// This contract is used for testing account upgrades.
const delegationOldPath = Path.resolve(
  import.meta.dirname,
  '../contracts/account/src/DelegationOld.sol',
)
await Fs.writeFile(
  delegationOldPath,
  await Fs.readFile(
    Path.resolve(
      import.meta.dirname,
      '../contracts/account/src/Delegation.sol',
    ),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "0.0.1";')
      .replace('contract Delegation', 'contract DelegationOld'),
  ),
)
