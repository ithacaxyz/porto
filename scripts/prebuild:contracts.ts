import * as Fs from 'node:fs/promises'
import * as Path from 'node:path'

// Make a `PortoAccountOld.sol` and rewrite with old domain version.
// This contract is used for testing account upgrades.
const accountOldPath = Path.resolve(
  import.meta.dirname,
  '../contracts/account/src/PortoAccountOld.sol',
)
await Fs.writeFile(
  accountOldPath,
  await Fs.readFile(
    Path.resolve(
      import.meta.dirname,
      '../contracts/account/src/PortoAccount.sol',
    ),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "0.0.1";')
      .replace('contract PortoAccount', 'contract PortoAccountOld'),
  ),
)

// Make a `PortoAccountNew.sol` and rewrite with new domain version.
// This contract is used for testing account upgrades.
const accountNewPath = Path.resolve(
  import.meta.dirname,
  '../contracts/account/src/PortoAccountNew.sol',
)
await Fs.writeFile(
  accountNewPath,
  await Fs.readFile(
    Path.resolve(
      import.meta.dirname,
      '../contracts/account/src/PortoAccount.sol',
    ),
    'utf-8',
  ).then((content) =>
    content
      .replace(/version = "\d+\.\d+\.\d+";/, 'version = "69.0.0";')
      .replace('contract PortoAccount', 'contract PortoAccountNew'),
  ),
)
