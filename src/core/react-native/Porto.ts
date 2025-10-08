import type * as Chains from '../Chains.js'
import type { ExactPartial } from '../internal/types.js'
import * as Mode from '../Mode.js'
import * as PortoBase from '../Porto.js'

export const defaultConfig = {
  ...PortoBase.defaultConfig,
  mode: Mode.reactNative(),
} as const satisfies Partial<Config>

export type Config<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = PortoBase.Config<chains>

export function create<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(parameters?: ExactPartial<Config<chains>> | undefined): Porto<chains>
export function create(
  parameters: ExactPartial<Config> | undefined = {},
): Porto {
  return PortoBase.create({
    ...parameters,
    mode: parameters.mode ?? defaultConfig.mode,
  })
}

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = PortoBase.Porto<chains>
