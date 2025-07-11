import { PortoConfig } from '@porto/apps'
import {
  exp1Address as exp1Address_,
  exp2Address as exp2Address_,
  expNftAddress as expNftAddress_,
} from '@porto/apps/contracts'
import { createStore } from 'mipd'
import { Hex, Value } from 'ox'
import { Dialog, Mode, Porto } from 'porto'

const config = PortoConfig.getConfig()
const host = PortoConfig.getDialogHost()
const chainId = config.chains[0].id

export const exp1Address = exp1Address_[chainId]
export const exp2Address = exp2Address_[chainId]
export const expNftAddress = expNftAddress_[chainId]

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
  rpc: Mode.rpcServer(),
}
export type ModeType = keyof typeof modes

export const mipd = createStore()

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    feeLimit: {
      currency: 'USD',
      value: '1',
    },
    permissions: {
      calls: [
        {
          to: exp1Address,
        },
        {
          to: exp2Address,
        },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
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

const merchant = new URLSearchParams(window.location.search).get('merchant')

export const porto = Porto.create({
  ...config,
  merchantRpcUrl: merchant ? '/merchant' : undefined,
  // We will be deferring mode setup until after hydration.
  mode: null,
})
