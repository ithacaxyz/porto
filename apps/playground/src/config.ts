import { PortoConfig } from '@porto/apps'
import { exp1Address, exp2Address } from '@porto/apps/contracts'
import { createStore } from 'mipd'
import { Hex, Value } from 'ox'
import { Chains, Dialog, Mode, Porto } from 'porto'
import type { ThemeFragment } from 'porto/theme'
import { RelayClient } from 'porto/viem'

export type ChainId = (typeof config.chains)[number]['id']

const config = PortoConfig.getConfig()
const host =
  new URLSearchParams(window.location.search).get('dialogHost') ||
  PortoConfig.getDialogHost()

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
  'page-dialog': (parameters: Mode.dialog.Parameters) =>
    Mode.dialog({
      host,
      renderer: Dialog.popup({ type: 'page' }),
      ...parameters,
    }),
  'popup-dialog': (parameters: Mode.dialog.Parameters) =>
    Mode.dialog({
      host,
      renderer: Dialog.popup({ type: 'popup' }),
      ...parameters,
    }),
} as const

export const modes = {
  rpc: () => Mode.relay(),
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

export const permissions = ({ chainId }: { chainId: ChainId }) => {
  const exp1Token = exp1Address[chainId as keyof typeof exp1Address]
  if (!exp1Token) {
    console.warn(`exp1 address not defined for chainId ${chainId}`)
    return undefined
  }
  const exp2Token = exp2Address[chainId as keyof typeof exp2Address]
  if (!exp2Token) {
    console.warn(`exp2 address not defined for chainId ${chainId}`)
    return undefined
  }
  return {
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '1',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        {
          to: exp1Token,
        },
        {
          to: exp2Token,
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
          token: exp1Token,
        },
      ],
    },
  } as const
}

const merchant = new URLSearchParams(window.location.search).get('merchant')

const baseChains = [Chains.baseSepolia, Chains.optimismSepolia] as const
const chains = [
  ...baseChains,
  ...config.chains.filter(
    (chain) => !baseChains.some((x) => x.id === chain.id),
  ),
] as const

export const porto = Porto.create({
  ...config,
  chains,
  merchantUrl: merchant ? '/merchant' : undefined,
  // We will be deferring mode setup until after hydration.
  mode: null,
})

export const client = RelayClient.fromPorto(porto)
