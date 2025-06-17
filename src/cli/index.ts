#!/usr/bin/env node
import { cac } from 'cac'

import pkgJson from '../package.json' with { type: 'json' }
import * as Commands from './internal/commands.js'
import * as Utils from './internal/utils.js'

const cli = cac('porto')

cli.command('[root]', 'Display usage').action(cli.outputHelp)

cli
  .command('create-account [alias: ca]', 'Create a Porto Account')
  .alias('ca')
  .option(
    '-c, --chain <chain>',
    `Chain name (available: ${Utils.getChainNames().join(', ')})`,
    { default: 'base-sepolia' },
  )
  .option('-r, --rpc <rpc_url>', 'RPC server URL')
  .action(Commands.createAccount)

cli.help()
cli.version(pkgJson.version)

cli.parse()
