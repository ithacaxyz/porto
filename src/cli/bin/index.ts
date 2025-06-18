#!/usr/bin/env node
import { cac } from 'cac'

import pkgJson from '../../package.json' with { type: 'json' }
import * as Commands from '../internal/commands.js'

const cli = cac('porto')

cli.command('[root]', 'Display usage').action(cli.outputHelp)

cli
  .command('onboard [alias: o]', 'Create a Porto Account')
  .alias('o')
  .option('-d, --dialog <hostname>', 'Dialog hostname', {
    default: 'id.porto.sh',
  })
  .action(Commands.createAccount)

cli.help()
cli.version(pkgJson.version)

cli.parse()
