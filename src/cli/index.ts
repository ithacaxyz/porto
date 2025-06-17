#!/usr/bin/env node
import * as prompts from '@clack/prompts'
import { cac } from 'cac'
import { createClient, http } from 'viem'
import { getChainId } from 'viem/actions'

import * as Chains from '../core/Chains.js'
import * as Key from '../viem/Key.js'
import * as ServerActions from '../viem/ServerActions.js'
import pkgJson from '../package.json' with { type: 'json' }

const cli = cac('porto')

cli.command('[root]', 'Display usage').action(cli.outputHelp)

cli
  .command('create-merchant [alias: cm]', 'Create a merchant account')
  .alias('cm')
  .option(
    '-c, --chain <chain>',
    `Chain name (available: ${Utils.getChainNames().join(', ')})`,
    { default: 'base-sepolia' },
  )
  .option('-r, --rpc <rpc_url>', 'RPC server URL')
  .action(Commands.createMerchant)

cli.help()
cli.version(pkgJson.version)

cli.parse()

namespace Commands {
  /** Creates a merchant account. */
  export async function createMerchant(
    _: unknown,
    args: createMerchant.Arguments,
  ) {
    const client = await Context.getClient(args)

    prompts.intro('Create Merchant Account')

    const key = Key.createSecp256k1()

    const s = prompts.spinner()
    s.start('Creating...')
    const account = await ServerActions.createAccount(client, {
      authorizeKeys: [key],
    }).catch((error) => {
      s.stop('Failed. ')
      throw error
    })
    s.stop('Created. ')

    prompts.log.info('Address:     ' + account.address)
    prompts.log.info('Private key: ' + key.privateKey!()!)
  }

  export declare namespace createMerchant {
    type Arguments = {
      /** Chain name. */
      chain?: string | undefined
      /** RPC Server URL. */
      rpc?: string | undefined
    }
  }
}

namespace Context {
  /** Gets a Viem client for RPC Server. */
  export async function getClient(options: getPorto.Options = {}) {
    const chain = Utils.kebabToCamel(options.chain!) as keyof typeof Chains
    const client = createClient({
      chain: Chains[chain] as Chains.Chain,
      transport: http(options.rpc),
    })
    client.chain = {
      ...client.chain,
      id: (await getChainId(client)) as never,
    }
    return client
  }

  export declare namespace getPorto {
    type Options = {
      /** Chain name. */
      chain?: string | undefined
      /** RPC Server URL. */
      rpc?: string | undefined
    }
  }
}

namespace Utils {
  /** Gets all chain names. */
  export function getChainNames() {
    return Object.entries(Chains)
      .filter(([_, chain]) => typeof chain === 'object' && 'id' in chain)
      .map(([key]) => camelToKebab(key))
  }

  /** Converts kebab-case string to camelCase. */
  export function kebabToCamel(str: string): string {
    return str
      .split('-')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('')
  }

  /** Converts camelCase string to kebab-case. */
  export function camelToKebab(str: string): string {
    return str
      .split(/(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('-')
  }
}
