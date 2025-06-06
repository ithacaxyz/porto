import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'

// Make a `IthacaAccountOld.sol` and rewrite with old domain version.
// This contract is used for testing account upgrades.
const accountOldPath = Path.resolve(
  import.meta.dirname,
  '../contracts/account/src/IthacaAccountOld.sol',
)
await Fs.writeFile(
  accountOldPath,
  await Fs.readFile(
    Path.resolve(
      import.meta.dirname,
      '../contracts/account/src/IthacaAccount.sol',
    ),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "0.0.1";')
      .replace('contract IthacaAccount', 'contract IthacaAccountOld'),
  ),
)

// Make a `IthacaAccountNew.sol` and rewrite with new domain version.
// This contract is used for testing account upgrades.
const accountNewPath = Path.resolve(
  import.meta.dirname,
  '../contracts/account/src/IthacaAccountNew.sol',
)
await Fs.writeFile(
  accountNewPath,
  await Fs.readFile(
    Path.resolve(
      import.meta.dirname,
      '../contracts/account/src/IthacaAccount.sol',
    ),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "69.0.0";')
      .replace('contract IthacaAccount', 'contract IthacaAccountNew'),
  ),
)
