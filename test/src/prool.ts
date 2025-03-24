import { spawnSync } from 'node:child_process'
import { defineInstance, toArgs } from 'prool'
import { execa } from 'prool/processes'

type RelayParameters = {
  endpoint: string
  entrypoint: string
  feeTokens: string[]
  http?: {
    port?: number | undefined
    metricsPort?: number | undefined
  }
  quoteSecretKey?: string | undefined
  secretKey?: string | undefined
  txGasBuffer?: bigint | undefined
  userOpGasBuffer?: bigint | undefined
}

export const poolId =
  Number(process.env.VITEST_POOL_ID ?? 1) *
  Number(process.env.VITEST_SHARD_ID ?? 1) *
  Math.floor(Math.random() * 10000)

export const relay = defineInstance((parameters?: RelayParameters) => {
  const args = (parameters || {}) as RelayParameters
  const {
    endpoint,
    entrypoint,
    feeTokens,
    secretKey = '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356', // anvil key
    quoteSecretKey = '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97', // anvil key
    ...rest
  } = args

  const host = 'localhost'
  const name = 'relay'
  const process = execa({ name })
  let port = args.http?.port ?? 9119

  const containerName = crypto.randomUUID()

  return {
    _internal: {
      args,
      get process() {
        return process._internal.process
      },
    },
    host,
    name,
    port,
    async start({ port: port_ = port }, options) {
      port = port_

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
        'ghcr.io/ithacaxyz/relay:latest',
        ...toArgs({
          ...rest,
          endpoint: endpoint?.replaceAll(
            /127\.0\.0\.1|0\.0\.0\.0/g,
            'host.docker.internal',
          ),
          entrypoint,
          http: {
            port,
            metricsPort: port + 1,
          },
          secretKey,
          quoteSecretKey,
        } satisfies Partial<RelayParameters>),
        ...feeTokens.flatMap((feeToken) => ['--fee-token', feeToken]),
      ]

      return await process.start(($) => $`docker run ${args_}`, {
        ...options,
        resolver({ process, resolve, reject }) {
          process.stdout.on('data', (data) => {
            const message = data.toString()
            if (message.includes('Started relay service')) resolve()
          })
          process.stderr.on('data', (data) => {
            if (data.toString().includes('WARNING')) return
            reject(data)
          })
        },
      })
    },
    async stop() {
      spawnSync('docker', ['rm', '-f', containerName])
    },
  }
})
