import { spawnSync } from 'node:child_process'
import { rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { defineInstance, toArgs } from 'prool'
import { execa } from 'prool/processes'
import YAML from 'yaml'

type RpcServerParameters = {
  config?: string | undefined
  containerName?: string | undefined
  constantRate?: number | undefined
  endpoint: string
  escrow: string
  feeTokens: string[]
  delegationProxy: string
  funderSigningKey: string
  funderOwnerKey: string
  funder: string
  http?: {
    port?: number | undefined
    metricsPort?: number | undefined
  }
  image?: string | undefined
  interopToken: string
  legacyDelegationProxy?: string | undefined
  orchestrator: string
  quoteTtl?: number | undefined
  skipDiagnostics?: boolean | undefined
  signersMnemonic?: string | undefined
  simulator?: string | undefined
  txGasBuffer?: bigint | undefined
  intentGasBuffer?: bigint | undefined
  version?: string | undefined
}

export const poolId =
  Number(process.env.VITEST_POOL_ID ?? 1) *
  Number(process.env.VITEST_SHARD_ID ?? 1) *
  Math.floor(Math.random() * 10000)

let pulled = false

export const rpcServer = defineInstance((parameters?: RpcServerParameters) => {
  const args = (parameters || {}) as RpcServerParameters
  const {
    containerName = crypto.randomUUID(),
    endpoint,
    feeTokens,
    image = 'ghcr.io/ithacaxyz/relay',
    interopToken,
    signersMnemonic = 'test test test test test test test test test test test junk',
    version = process.env.VITE_RELAY_VERSION || 'latest',
    ...rest
  } = args

  const host = 'localhost'
  const name = 'relay'
  const process_ = execa({ name })

  let port = args.http?.port ?? 9119

  async function stop() {
    await rm(configPath)
    spawnSync('docker', ['rm', '-f', containerName])
  }

  const configPath = resolve(import.meta.dirname, `relay.${containerName}.yaml`)

  return {
    _internal: {
      args,
      get process() {
        return process_._internal.process
      },
    },
    host,
    name,
    port,
    async start({ port: port_ = port }, options) {
      port = port_

      if (!pulled) {
        spawnSync('docker', [
          'pull',
          `${image}:${version}`,
          '--platform',
          'linux/x86_64',
        ])
        pulled = true
      }

      const enableInterop = false
      const content = createRelayConfig({
        delegationProxy: rest.delegationProxy,
        enableInterop,
        endpoint: endpoint?.replaceAll(
          /127\.0\.0\.1|0\.0\.0\.0/g,
          'host.docker.internal',
        ),
        escrow: rest.escrow,
        feeTokens,
        funder: rest.funder,
        intentGasBuffer: rest.intentGasBuffer,
        interopToken,
        orchestrator: rest.orchestrator,
        simulator: rest.simulator,
      })
      await writeFile(configPath, content)

      const args_ = [
        '--name',
        containerName,
        '--network',
        'host',
        '--platform',
        'linux/x86_64',
        '--add-host',
        'host.docker.internal:host-gateway',
        '--add-host',
        'localhost:host-gateway',
        '-p',
        `${port}:${port}`,
        '-v',
        `${configPath}:/app/relay.yaml`,
        `${image}:${version}`,
        ...toArgs({
          ...rest,
          config: '/app/relay.yaml',
          constantRate: 1.0,
          http: {
            metricsPort: port + 1,
            port,
          },
          quoteTtl: 30,
          signersMnemonic,
        } satisfies Partial<RpcServerParameters>),
      ]

      const debug = process.env.VITE_RPC_DEBUG === 'true'
      return await process_.start(($) => $`docker run ${args_}`, {
        ...options,
        resolver({ process, resolve, reject }) {
          // TODO: remove once relay has feedback on startup.
          setTimeout(3_000).then(resolve)
          process.stdout.on('data', (data) => {
            const message = data.toString()
            if (debug) console.log(message)
            if (message.includes('Started relay service')) resolve()
          })
          process.stderr.on('data', async (data) => {
            const message = data.toString()
            if (debug) console.log(message)
            if (message.includes('WARNING')) return
            reject(data)
          })
        },
      })
    },
    async stop() {
      return await stop()
    },
  }
})

function createRelayConfig(opts: {
  delegationProxy: string
  enableInterop: boolean
  endpoint: string
  escrow: string
  feeTokens: string[]
  funder: string
  intentGasBuffer: bigint | undefined
  interopToken: string
  orchestrator: string
  simulator: string | undefined
}) {
  return YAML.stringify({
    chains: {
      anvil: {
        assets: Object.fromEntries(
          opts.feeTokens.map((feeToken, index) => [
            feeToken === '0x0000000000000000000000000000000000000000'
              ? 'ethereum'
              : `exp${index}`,
            {
              address: feeToken,
              fee_token: true,
              interop: opts.enableInterop && feeToken === opts.interopToken,
            },
          ]),
        ),
        endpoint: opts.endpoint,
      },
    },
    delegation_proxy: opts.delegationProxy,
    escrow: opts.escrow,
    fee_recipient: '0x6a658769C4117012A9B6614A0C42e319A5f88e95',
    funder: opts.funder,
    legacy_delegation_proxies: [],
    legacy_orchestrators: [],
    orchestrator: opts.orchestrator,
    quote: {
      gas: {
        intentBuffer: opts.intentGasBuffer ?? 10000,
        txBuffer: 100000,
      },
      rateTtl: 600,
      ttl: 300,
    },
    server: {
      address: '127.0.0.1',
      max_connections: 1000,
      metrics_port: 9000,
      port: 9119,
    },
    simulator: opts.simulator,
    transactions: {
      balance_check_interval: 5,
      max_pending_transactions: 100,
      max_queued_per_eoa: 1,
      max_transactions_per_signer: 16,
      nonce_check_interval: 60,
      num_signers: 1,
      priority_fee_percentile: 20,
      public_node_endpoints: {},
      transaction_timeout: 60,
    },
    ...(opts.enableInterop
      ? {
          interop: {
            settler: {
              simple: {
                settler_address: '0x',
              },
              wait_verification_timeout: 100000,
            },
          },
        }
      : {}),
  })
}
