import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  baseSepolia as wcBaseSepolia,
  odysseyTestnet as wcOdysseyTestnet,
  optimismSepolia as wcOptimismSepolia,
} from '@reown/appkit/networks'
import {
  type Metadata as ReownMetadata,
  createAppKit,
} from '@reown/appkit/react'
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import * as React from 'react'
import { toast } from 'sonner'
import { WagmiProvider, useSignMessage } from 'wagmi'
import '@reown/appkit-wallet-button/react'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'

import { cn } from '~/utils'

const WC_PROJECT_ID = '562ca4dfff573b4885cd05dbbb086860'

const metadata = {
  name: 'Porto',
  description: 'Porto',
  url: 'https://wallet.ithaca.xyz',
  icons: ['https://ithaca.xyz/icon.png'],
} satisfies ReownMetadata

const chains = [wcOdysseyTestnet, wcOptimismSepolia, wcBaseSepolia]

const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  networks: chains,
  projectId: WC_PROJECT_ID,
})

createAppKit({
  debug: import.meta.env.DEV,
  metadata,
  allWallets: 'SHOW',
  showWallets: false,
  enableCoinbase: true,
  enableInjected: false,
  adapters: [wagmiAdapter],
  projectId: WC_PROJECT_ID,
  enableWalletGuide: false,
  enableWalletConnect: true,
  networks: chains as never,
  features: {
    send: false,
    email: false,
    swaps: false,
    onramp: false,
    receive: false,
    history: false,
    socials: false,
    analytics: false,
    allWallets: false,
    smartSessions: false,
    collapseWallets: true,
  },
})

export default function WalletConnect(props: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as never}>
      <WalletConnectButton {...props} />
    </WagmiProvider>
  )
}

export function WalletConnectButton({
  className,
  children,
}: { className?: string; children?: React.ReactNode }) {
  const disconnect = useDisconnect()
  const { address } = useAppKitAccount()
  const { connect } = useAppKitWallet({
    onError: (error) => toast.error(error.message),
    onSuccess: (_data) => toast.success('Connected'),
  })
  const message = useSignMessage({ config: wagmiAdapter.wagmiConfig })

  return (
    <React.Fragment>
      <button
        type="button"
        onBlur={() => hideWallets()}
        onFocus={() => hideWallets()}
        onMouseUp={() => hideWallets()}
        onMouseDown={() => hideWallets()}
        onMouseMove={() => hideWallets()}
        onMouseLeave={() => hideWallets()}
        onMouseEnter={() => hideWallets()}
        onClick={() =>
          disconnect
            .disconnect()
            .then(() => connect('walletConnect'))
            .then(() =>
              message.signMessageAsync({
                account: address as `0x${string}`,
                message: `${new Date().toISOString()}\nI'm the owner of this wallet\nSigning a message to confirm my ownership`,
              }),
            )
            .then((signature) => toast.success(`Signed\n${signature}`))
            .catch((_) => toast.error('WalletConnect failed'))
        }
        className={cn(
          className,
          'mx-5 flex h-12 w-full max-w-full items-center justify-between space-x-4 rounded-md border-none p-1 hover:cursor-pointer hover:bg-gray3',
        )}
      >
        {children ?? 'WalletConnect'}
      </button>
    </React.Fragment>
  )
}

function hideWallets() {
  try {
    const injectedWallets = document
      .querySelector('w3m-modal')
      ?.shadowRoot?.querySelector('wui-flex')
      ?.firstElementChild?.children[1] //
      ?.shadowRoot?.firstElementChild //
      ?.firstElementChild?.shadowRoot //
      ?.firstElementChild?.children[1] //
      ?.firstElementChild?.firstElementChild //
      ?.shadowRoot?.firstElementChild //
      ?.firstElementChild?.shadowRoot //
      ?.firstElementChild?.querySelector('w3m-connect-injected-widget')

    injectedWallets?.setAttribute('class', 'hidden')
    injectedWallets?.setAttribute(
      'style',
      'width:0;height:0;display:none;visibility:hidden;',
    )
  } catch {
    void 0
  }
}
