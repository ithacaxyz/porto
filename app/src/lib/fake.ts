import * as React from 'react'
import BtcIcon from '~icons/cryptocurrency-color/btc'
import EthIcon from '~icons/cryptocurrency-color/eth'
import BaseIcon from '~icons/token-branded/base'

import { ExpIcon } from '~/components/Exp'
import { OpIcon } from '~/components/Op'

/**
 * This is temporary. Eventual goal is to switch to using an API to fetch web3 icons
 * e.g., https://api.ithaca.xyz/icons/:chain/:{address|coingecko-id}
 */
export const TokenIcon = {
  Exp: (
    props: React.PropsWithChildren<React.ImgHTMLAttributes<HTMLImageElement>>,
  ) => React.createElement(ExpIcon, props),
  Op: (
    props: React.PropsWithChildren<React.ImgHTMLAttributes<HTMLImageElement>>,
  ) => React.createElement(OpIcon, props),
  Eth: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement(EthIcon, props),
  Base: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement(BaseIcon, props),
  Btc: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement(BtcIcon, props),
}

export const assets = [
  {
    name: 'Experiment',
    symbol: 'EXP',
    price: {
      value: 3,
      change: 0,
    },
    balance: {
      value: 100,
      native: 3_002.41,
    },
    icon: TokenIcon.Exp({ className: 'size-8' }),
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: {
      value: 2689,
      change: 3.66,
    },
    balance: {
      value: 13350.41,
      native: 3.354,
    },
    icon: TokenIcon.Eth({ className: 'size-8' }),
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'wBTC',
    price: {
      value: 99999,
      change: -4.2,
    },
    balance: {
      value: 1249494.3,
      native: 12.494943,
    },
    icon: TokenIcon.Btc({ className: 'size-8' }),
  },
  {
    name: 'Optimism',
    symbol: 'OP',
    price: {
      value: 3.35,
      change: 6.69,
    },
    balance: {
      value: 1_970.44,
      native: 1_970.44,
    },
    icon: TokenIcon.Op({ className: 'size-8 text-red-500' }),
  },
]
