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

      const content = createRelayConfig({
        endpoint: endpoint?.replaceAll(
          /127\.0\.0\.1|0\.0\.0\.0/g,
          'host.docker.internal',
        ),
        feeTokens,
        interopToken,
      })
      console.log(content)
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
  endpoint: string
  feeTokens: string[]
  interopToken: string
}) {
  const enableInterop = false
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
              interop: enableInterop && feeToken === opts.interopToken,
            },
          ]),
        ),
        endpoint: opts.endpoint,
      },
    },
    ...(enableInterop
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
    server: {
      address: '127.0.0.1',
      metrics_port: 9000,
      port: 9119,
    },
  })
}
