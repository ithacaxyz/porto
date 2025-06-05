import type * as Chains from '../Chains.js'
import type * as Mode from '../Mode.js'
import type { Config, Store } from '../Porto.js'

export type Internal<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  config: Config<chains>
  id: string
  getMode: () => Mode.Mode
  setMode: (i: Mode.Mode) => void
  store: Store<chains>
}
