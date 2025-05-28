import { spawnSync } from 'node:child_process'
import { createServer, Server } from 'node:http'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { setTimeout } from 'node:timers/promises'
import httpProxy from 'http-proxy'
import { RpcRequest } from 'ox'
import { defineInstance, toArgs } from 'prool'
import { execa } from 'prool/processes'

type RpcServerParameters = {
  accountRegistry: string
  containerName?: string | undefined
  endpoint: string
  delegationProxy: string
  feeTokens: string[]
  http?: {
    port?: number | undefined
    metricsPort?: number | undefined
  }
  image?: string | undefined
  orchestrator: string
  quoteTtl?: number | undefined
  registry?: string | undefined
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
    signersMnemonic = 'test test test test test test test test test test test junk',
    version = 'latest',
    ...rest
  } = args

  const host = 'localhost'
  const name = 'relay'
  const process_ = execa({ name })

  let port = args.http?.port ?? 9119
  let server: Server | undefined

  function stop() {
    if (server) {
      server.close()
      server = undefined
    }
    spawnSync('docker', ['rm', '-f', containerName])
  }

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

      const port_relay = port + 1

      const args_ = [
        '-e',
        `GECKO_API=${process.env.VITE_GECKO_API}`,
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
        `${port_relay}:${port_relay}`,
        '-v',
        `${resolve(import.meta.dirname, 'registry.yaml')}:/app/registry.yaml`,
        `${image}:${version}`,
        ...toArgs({
          ...rest,
          endpoint: endpoint?.replaceAll(
            /127\.0\.0\.1|0\.0\.0\.0/g,
            'host.docker.internal',
          ),
          http: {
            metricsPort: port_relay + 1,
            port: port_relay,
          },
          quoteTtl: 30,
          registry: '/app/registry.yaml',
          signersMnemonic,
        } satisfies Partial<RpcServerParameters>),
        ...feeTokens.flatMap((feeToken) => ['--fee-token', feeToken]),
      ]

      try {
        await process_.start(($) => $`docker run ${args_}`, {
          ...options,
          resolver({ process, resolve, reject }) {
            // TODO: remove once relay has feedback on startup.
            setTimeout(3_000).then(resolve)
            process.stdout.on('data', (data) => {
              const message = data.toString()
              if (message.includes('Started relay service')) resolve()
            })
            process.stderr.on('data', (data) => {
              const message = data.toString()
              if (message.includes('WARNING')) return
              reject(data)
            })
          },
        })

        const proxy = httpProxy.createProxyServer({
          ignorePath: true,
          ws: false,
        })
        server = createServer(async (req, res) => {
          const body = await new Promise<RpcRequest.RpcRequest>((resolve) => {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              resolve(JSON.parse(body || '{}'))
            })
          })

          const target = (() => {
            if (
              body.method &&
              (body.method.startsWith('relay_') ||
                body.method.startsWith('wallet_'))
            )
              return `http://${host}:${port_relay}`
            return endpoint
          })()

          return proxy.web(req, res, {
            buffer: Readable.from(JSON.stringify(body)),
            target,
          })
        }).listen(port)
        return await new Promise((resolve, reject) => {
          server!.on('error', reject)
          server!.on('listening', resolve)
        })
      } catch (error) {
        stop()
        throw error
      }
    },
    async stop() {
      stop()
    },
  }
})
