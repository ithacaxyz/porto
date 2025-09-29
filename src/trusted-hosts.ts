export type Hostname = string
export type Hosts = readonly [Hostname, Scope[]][]
export type Scope = 'allow-blind-sign' | 'allow-safari-iframe'

export const hosts = [
  ['anvil.localhost', ['allow-blind-sign', 'allow-safari-iframe']],
  ['app.ens.domains', ['allow-blind-sign', 'allow-safari-iframe']],
  ['app.uniswap.org', ['allow-blind-sign', 'allow-safari-iframe']],
  ['bluestake.vercel.app', ['allow-safari-iframe']],
  ['bungee.exchange', ['allow-blind-sign', 'allow-safari-iframe']],
  ['cartel.sh', ['allow-safari-iframe']],
  ['cctp.exchange', ['allow-safari-iframe']],
  ['cut-v2.mattlovan.dev', [ 'allow-safari-iframe']],
  ['daimo.ngrok.app', [ 'allow-safari-iframe']],
  ['eco.com', ['allow-safari-iframe']],
  ['happypath.enso.build', ['allow-safari-iframe']],
  ['id.porto.sh', ['allow-blind-sign', 'allow-safari-iframe']],
  ['jumper.exchange', ['allow-blind-sign', 'allow-safari-iframe']],
  ['localhost', ['allow-blind-sign',  'allow-safari-iframe']],
  ['paper.ink', ['allow-safari-iframe']],
  ['pay.daimo.com', ['allow-safari-iframe']],
  ['playground.li.fi', ['allow-safari-iframe']],
  ['playground.porto.sh', ['allow-blind-sign',  'allow-safari-iframe']],
  ['portal.eco.com', ['allow-safari-iframe']],
  ['porto.sh', ['allow-blind-sign',  'allow-safari-iframe']],       
  ['preview.porto.sh', ['allow-blind-sign',  'allow-safari-iframe']], 
  ['rath.fi', ['allow-safari-iframe']],
  ['relay.link', ['allow-blind-sign',  'allow-safari-iframe']],
  ['sponsor-porto.vercel.app', ['allow-safari-iframe']],
  ['stg.localhost', ['allow-blind-sign',  'allow-safari-iframe']],
  ['sushi.com', ['allow-blind-sign', 'allow-safari-iframe']],
  ['swap.defillama.com', ['allow-blind-sign', 'allow-safari-iframe']],
  ['uniswap.org', ['allow-blind-sign', 'allow-safari-iframe']],
  ['www.bungee.exchange', ['allow-blind-sign', 'allow-safari-iframe']],
  ['www.sushi.com', ['allow-blind-sign', 'allow-safari-iframe']],
  ['news.kiwistand.com', ['allow-safari-iframe']],
  ['app.cashmere.exchange', ['allow-safari-iframe']],
  ['mainnet.cashmere.exchange', ['allow-safari-iframe']],
] satisfies Hosts

export const hostnames = hosts.map(([host]) => host)

export function includes(hostname: string, scopes?: readonly Scope[] | undefined) {
  return hosts.some(([host, scopes_]) => {
    if (!scopes) return host === hostname
    return host === hostname && scopes.every((scope) => scopes_.includes(scope))
  })
}
