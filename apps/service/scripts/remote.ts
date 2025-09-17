/**
 * in order to develop against R2, we need to run `wrangler` in remote mode
 * Cloudflare Vite plugin does not support remote mode
 *
 * this script flips the `"remote": false` to `"remote": true` in the `wrangler.json` file
 * then runs `wrangler dev --config='wrangler.json'`
 * or simply run this file: `node ./scripts/remote.ts`
 */

import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import wranglerJSON from '#wrangler.json' with { type: 'json' }

function main() {
  NodeFS.writeFileSync(
    'wrangler.json',
    JSON.stringify(
      {
        ...wranglerJSON,
        r2_buckets: wranglerJSON.r2_buckets.map((bucket) => ({
          ...bucket,
          remote: true,
        })),
      },
      undefined,
      2,
    ),
    { encoding: 'utf-8', flag: 'w', mode: 0o644 },
  )

  try {
    ChildProcess.execSync(
      'pnpm dlx wrangler@latest --config="wrangler.json" dev',
      { stdio: 'inherit' },
    )
  } catch (error) {
    if (typeof error?.status === 'number') process.exitCode = error.status
    else process.exitCode = 1
  } finally {
    reset()
  }
}

let cleaned = false
function reset() {
  if (cleaned) return
  cleaned = true
  try {
    NodeFS.writeFileSync(
      'wrangler.json',
      JSON.stringify(
        {
          ...wranglerJSON,
          r2_buckets: wranglerJSON.r2_buckets.map((bucket) => ({
            ...bucket,
            remote: false,
          })),
        },
        undefined,
        2,
      ),
      { encoding: 'utf-8', flag: 'w', mode: 0o644 },
    )
  } catch {}
}

process.once('exit', reset)
process.once('SIGINT', () => [reset(), process.exit(130)])
process.once('SIGTERM', () => [reset(), process.exit(143)])
process.once('SIGQUIT', () => [reset(), process.exit(131)])
process.once('SIGHUP', () => [reset(), process.exit(129)])
process.once('uncaughtException', (err) => [
  console.error(err),
  reset(),
  process.exit(1),
])
process.once('unhandledRejection', (reason) => [
  console.error(reason),
  reset(),
  process.exit(1),
])

main()
