import { PortoConfig } from '@porto/apps'
import {
  exp1Address as exp1Address_,
  exp2Address as exp2Address_,
  expNftAddress as expNftAddress_,
} from '@porto/apps/contracts'
import { createStore } from 'mipd'
import { Hex, Value } from 'ox'
import { Dialog, Mode, Porto } from 'porto'
import { ThemeFragment } from 'porto/theme'

const config = PortoConfig.getConfig()
const host = PortoConfig.getDialogHost()
const chainId = config.chains[0].id

export const exp1Address = exp1Address_[chainId]
export const exp2Address = exp2Address_[chainId]
export const expNftAddress = expNftAddress_[chainId]

export const modes = {
  contract: () => Mode.contract(),
  'iframe-dialog': (theme: ThemeType) =>
    Mode.dialog({
      host,
      theme: themes[theme],
    }),
  'inline-dialog': (theme: ThemeType) =>
    Mode.dialog({
      host,
      renderer: Dialog.experimental_inline({
        element: () => document.getElementById('porto')!,
      }),
      theme: themes[theme],
    }),
  'popup-dialog': (theme: ThemeType) =>
    Mode.dialog({
      host,
      renderer: Dialog.popup(),
      theme: themes[theme],
    }),
  rpc: () => Mode.rpcServer(),
} as const

export type ModeType = keyof typeof modes

export const themes = {
  default: undefined,
  pink: {
    colorScheme: 'light',
    accent: '#FF007A',
    baseBackground: '#FCFCFC',
    baseBorder: '#F0F0F0',
    baseContent: '#202020',
    baseContentDimmed: '#8D8D8D',
    baseHoveredBackground: '#F0F0F0',
    fieldBackground: '#F0F0F0',
    fieldBorder: '#F0F0F0',
    fieldContent: '#202020',
    fieldErrorBorder: '#F0F',
    fieldFocusedBackground: '#F0F0F0',
    fieldFocusedContent: '#202020',
    focus: '#FF007A',
    frameBackground: '#FF007A',
    frameBorder: 'transparent',
    frameContent: '#FFFFFF',
    frameRadius: 14,
    iconInfoBackground: '#FCE3EF',
    iconInfoContent: '#FF007A',
    link: '#FF007A',
    negativeBackground: '#F0F',
    negativeContent: '#F0F',
    positiveBackground: '#F0F',
    positiveContent: '#F0F',
    primaryBackground: '#FF007A',
    primaryBorder: '#F0F0F0',
    primaryContent: '#FFFFFF',
    primaryHoveredBackground: '#FF007A',
    primaryHoveredBorder: '#FF007A',
    separator: '#F0F0F0',
  },
} as const satisfies Record<string, ThemeFragment | undefined>
export type ThemeType = keyof typeof themes

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
