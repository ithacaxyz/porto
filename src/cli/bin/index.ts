#!/usr/bin/env node
import { cac } from 'cac'

import pkgJson from '../../package.json' with { type: 'json' }
import * as Commands from '../internal/commands.js'

const cli = cac('porto')

cli.command('[root]', 'Display usage').action(cli.outputHelp)

cli
  .command('create-account [alias: ca]', 'Create a Porto Account')
  .alias('ca')
  .option('-d, --dialog <hostname>', 'Dialog hostname', {
    default: 'id.porto.sh',
  })
  .action(Commands.createAccount)

cli.help()
cli.version(pkgJson.version)

cli.parse()
