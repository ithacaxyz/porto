#!/usr/bin/env node
import { cac } from 'cac'

import pkgJson from '../../package.json' with { type: 'json' }

const cli = cac('porto')

cli.command('[root]', 'Display usage').action(() => {
  cli.outputHelp()
  process.exit(0)
})

cli
  .command('onboard [alias: o]', 'Create a Porto Account')
  .alias('o')
  .option(
    '-a, --admin-key',
    'Create and provision an additional admin key for server access',
    {
      default: false,
    },
  )
  .option('-d, --dialog <hostname>', 'Dialog hostname', {
    default: 'stg.id.porto.sh',
  })
  .action(async (_, args) => {
    const Commands = await import('../internal/commands.js')
    return Commands.createAccount(null, args)
  })

cli.help()
cli.version(pkgJson.version)

cli.parse()
