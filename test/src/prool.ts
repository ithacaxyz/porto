import { spawnSync } from 'node:child_process'
import { defineInstance, toArgs } from 'prool'
import { execa } from 'prool/processes'

type RelayParameters = {
  endpoint: string
  feeToken: string
  secretKey?: string | undefined
  quoteSecretKey?: string | undefined
  http?: {
    port?: number | undefined
  }
}

export const relay = defineInstance((parameters?: RelayParameters) => {
  const args = (parameters || {}) as RelayParameters
  const {
    endpoint,
    feeToken,
    secretKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // anvil key
    quoteSecretKey = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', // anvil key
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
          http: {
            port,
          },
          feeToken,
          secretKey,
          quoteSecretKey,
        } satisfies Partial<RelayParameters>),
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
