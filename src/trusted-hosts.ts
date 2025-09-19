export type Hostname = string
export type Hostnames = readonly [Hostname, Scope[]][]
export type Scope = 'allow-blind-sign' | 'allow-merchant-rpc' | 'allow-iframe'

export const hosts = [
  ['anvil.localhost', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],
  ['app.ens.domains', ['allow-blind-sign', 'allow-iframe']],
  ['app.uniswap.org', ['allow-blind-sign', 'allow-iframe']],
  ['bluestake.vercel.app', ['allow-iframe', 'allow-merchant-rpc']],
  ['bungee.exchange', ['allow-blind-sign', 'allow-iframe']],
  ['cartel.sh', ['allow-iframe']],
  ['cctp.exchange', ['allow-iframe']],
  ['cut-v2.mattlovan.dev', ['allow-merchant-rpc', 'allow-iframe']],
  ['daimo.ngrok.app', ['allow-merchant-rpc', 'allow-iframe']],
  ['eco.com', ['allow-iframe']],
  ['happypath.enso.build', ['allow-iframe']],
  ['id.porto.sh', ['allow-blind-sign', 'allow-iframe']],
  ['jumper.exchange', ['allow-blind-sign', 'allow-iframe']],
  ['localhost', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],
  ['paper.ink', ['allow-iframe']],
  ['pay.daimo.com', ['allow-iframe']],
  ['playground.li.fi', ['allow-iframe']],
  ['playground.porto.sh', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],
  ['portal.eco.com', ['allow-iframe']],
  ['porto.sh', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],       
  ['preview.porto.sh', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']], 
  ['rath.fi', ['allow-iframe']],
  ['relay.link', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],
  ['sponsor-porto.vercel.app', ['allow-iframe']],
  ['stg.localhost', ['allow-blind-sign', 'allow-merchant-rpc', 'allow-iframe']],
  ['swap.defillama.com', ['allow-blind-sign', 'allow-iframe']],
  ['uniswap.org', ['allow-blind-sign', 'allow-iframe']],
  ['www.bungee.exchange', ['allow-blind-sign', 'allow-iframe']],
] satisfies Hostnames

export const hostnames = hosts.map(([host]) => host)

export function includes(hostname: string, scopes?: readonly Scope[] | undefined) {
  return hosts.some(([host, scopes_]) => {
    if (!scopes) return host === hostname
    return host === hostname && scopes.every((scope) => scopes_.includes(scope))
  })
}