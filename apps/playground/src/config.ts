import { PortoConfig } from '@porto/apps'
import { exp1Address, exp2Address } from '@porto/apps/contracts'
import { createStore } from 'mipd'
import { Hex, Value } from 'ox'
import { Dialog, Mode, Porto } from 'porto'
import type { ThemeFragment } from 'porto/theme'

export type ChainId = (typeof config.chains)[number]['id']

const config = PortoConfig.getConfig()
const host = PortoConfig.getDialogHost()

const dialogModes = {
  'iframe-dialog': (parameters: Mode.dialog.Parameters) =>
    Mode.dialog({
      host,
      ...parameters,
    }),
  'inline-dialog': (parameters: Mode.dialog.Parameters) =>
    Mode.dialog({
      host,
      renderer: Dialog.experimental_inline({
        element: () => document.getElementById('porto')!,
      }),
      ...parameters,
    }),
  'popup-dialog': (parameters: Mode.dialog.Parameters) =>
    Mode.dialog({
      host,
      renderer: Dialog.popup(),
      ...parameters,
    }),
} as const

export const modes = {
  contract: () => Mode.contract(),
  rpc: () => Mode.rpcServer(),
  ...dialogModes,
} as const

export type ModeType = keyof typeof modes
export type DialogModeType = keyof typeof dialogModes
export type DialogMode = ReturnType<(typeof modes)[DialogModeType]>

export function isDialogModeType(mode: ModeType): mode is DialogModeType {
  return mode in dialogModes
}

export const themes = {
  dark: { colorScheme: 'dark' },
  default: { colorScheme: 'light dark' },
  light: { colorScheme: 'light' },
  pink: {
    badgeBackground: '#ffffff',
    badgeContent: '#ff007a',
    badgeInfoBackground: '#fce3ef',
    badgeInfoContent: '#ff007a',
    badgeStrongBackground: '#ffffff',
    badgeStrongContent: '#ff007a',
    baseBackground: '#fcfcfc',
    baseBorder: '#f0f0f0',
    baseContent: '#202020',
    baseContentSecondary: '#8d8d8d',
    baseHoveredBackground: '#f0f0f0',
    colorScheme: 'light',
    fieldBackground: '#f0f0f0',
    fieldBorder: '#f0f0f0',
    fieldContent: '#202020',
    fieldErrorBorder: '#f0f',
    fieldFocusedBackground: '#f0f0f0',
    fieldFocusedContent: '#202020',
    focus: '#ff007a',
    frameBackground: '#ff007a',
    frameBorder: 'transparent',
    frameContent: '#ffffff',
    frameRadius: 14,
    link: '#ff007a',
    negativeBackground: '#f0f',
    negativeContent: '#f0f',
    positiveBackground: '#f0f',
    positiveContent: '#f0f',
    primaryBackground: '#ff007a',
    primaryBorder: '#ff007a',
    primaryContent: '#ffffff',
    primaryHoveredBackground: '#ff2994',
    primaryHoveredBorder: '#ff2994',
    separator: '#f0f0f0',
  },
} as const satisfies Record<string, ThemeFragment>
export type ThemeType = keyof typeof themes

export const mipd = createStore()

export const permissions = ({ chainId }: { chainId: ChainId }) =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    feeLimit: {
      currency: 'USD',
      value: '1',
    },
    permissions: {
      calls: [
        {
          to: exp1Address[chainId],
        },
        {
          to: exp2Address[chainId],
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
          token: exp1Address[chainId],
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
