import type * as Chains from '../core/Chains.js'
import type { ExactPartial } from '../core/internal/types.js'
import * as Mode from '../core/Mode.js'
import * as PortoBase from '../core/Porto.js'

export const defaultConfig = {
  ...PortoBase.defaultConfig,
  mode: Mode.reactNative(),
} as const satisfies Partial<Config>

export type Config<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Omit<PortoBase.Config<chains>, 'mode'> & { mode: Mode.Mode | null }

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
