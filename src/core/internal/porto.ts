import type * as Chains from '../Chains.js'
import type { Config, Store } from '../Porto.js'

export type Internal<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  config: Config<chains>
  store: Store<chains>
}
