import { Env, Porto as PortoConfig } from '@porto/apps'
import {
  exp1Address as exp1Address_,
  exp2Address as exp2Address_,
} from '@porto/apps/contracts'
import { createStore } from 'mipd'
import { Hex, Value } from 'ox'
import { Chains, Dialog, Mode, Porto } from 'porto'

export const env = Env.get()

const config = PortoConfig.config[env]
const defaultChainId = config.chains[0].id

export const exp1Address = exp1Address_[defaultChainId]
export const exp2Address = exp2Address_[defaultChainId]

const host = PortoConfig.dialogHosts[env]
export const modes = {
  contract: Mode.contract(),
  'iframe-dialog': Mode.dialog({
    host,
  }),
  'inline-dialog': Mode.dialog({
    host,
    renderer: Dialog.experimental_inline({
      element: () => document.getElementById('porto')!,
    }),
  }),
  'popup-dialog': Mode.dialog({
    host,
    renderer: Dialog.popup(),
  }),
  relay: Mode.relay({
    feeToken: {
      [Chains.odysseyTestnet.id]: exp1Address,
    },
  }),
}
export type ModeType = keyof typeof modes

export const mipd = createStore()

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    permissions: {
      calls: [
        {
          to: exp1Address,
        },
        {
          to: exp2Address,
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50')),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

export const porto = Porto.create({
  ...config,
  // We will be deferring mode setup until after hydration.
  mode: null,
})
