import {
  type Connector,
  createConnector,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
} from '@wagmi/core'
import {
  type Address,
  type Chain,
  type ProviderConnectInfo,
  type RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  withRetry,
  numberToHex,
} from 'viem'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import type * as Chains from '../../core/Chains.js'
import type { ExactPartial } from '../../core/internal/types.js'

export type WalletConnectV2Parameters<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  /** Project ID from WalletConnect Cloud */
  projectId: string
  /** Chains to support */
  chains?: chains
  /** Optional metadata for your app */
  metadata?: {
    name?: string
    description?: string
    url?: string
    icons?: string[]
  }
  /** Optional QR code modal options */
  qrModalOptions?: {
    themeMode?: 'light' | 'dark'
    themeVariables?: Record<string, string>
  }
  /** Optional relay URL */
  relayUrl?: string
  /** Optional custom RPC URLs */
  rpcMap?: Record<number, string>
}

export function walletConnectV2<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(parameters: WalletConnectV2Parameters<chains>) {
  const { projectId, chains: chains_, metadata, qrModalOptions, relayUrl, rpcMap } = parameters

  type Provider = EthereumProvider
  type Properties = {
    connect<withCapabilities extends boolean = false>(parameters?: {
      chainId?: number | undefined
      capabilities?:
        | {
            force?: boolean | undefined
          }
        | undefined
      isReconnecting?: boolean | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }): Promise<{
      accounts: withCapabilities extends true
        ? readonly {
            address: Address
            capabilities: {
              permissions: any
              signInWithEthereum?: {
                message: string
                signature: `0x${string}`
              }
            }
          }[]
        : readonly Address[]
      chainId: number
    }>
    disconnect(): Promise<void>
    getAccounts(): Promise<readonly Address[]>
    getChainId(): Promise<number>
    getProvider(): Promise<Provider>
    isAuthorized(): Promise<boolean>
    switchChain(parameters: { chainId: number }): Promise<Chain>
    onAccountsChanged(accounts: Address[]): void
    onChainChanged(chainId: number): void
    onConnect(connectInfo: ProviderConnectInfo): void
    onDisconnect(error: RpcError): void
  }

  let provider: Provider | undefined
  let accountsChanged: ((accounts: Address[]) => void) | undefined
  let chainChanged: ((chainId: number) => void) | undefined
  let connect: ((connectInfo: ProviderConnectInfo) => void) | undefined
  let disconnect: ((error: RpcError) => void) | undefined

  return createConnector<Provider, Properties>((wagmiConfig) => {
    const chains = chains_ ?? wagmiConfig.chains

    return {
      id: 'walletConnectV2',
      name: 'WalletConnect v2',
      type: 'walletConnect',
      icon: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',

      async connect({ chainId = chains[0].id, ...rest } = {}) {
        try {
          // Initialize WalletConnect provider if not already done
          if (!provider) {
            provider = await EthereumProvider.init({
              projectId,
              chains: [chainId],
              showQrModal: true,
              metadata: metadata ?? {
                name: 'Porto App',
                description: 'Porto WalletConnect Integration',
                url: typeof window !== 'undefined' ? window.location.origin : '',
                icons: ['https://avatars.githubusercontent.com/u/37784886?s=200&v=4'],
              },
              qrModalOptions,
              relayUrl,
              rpcMap,
            })
          }

          // Check if already connected
          if (provider.accounts.length > 0) {
            throw new ConnectorAlreadyConnectedError()
          }

          // Connect to WalletConnect
          await provider.connect()

          // Get accounts and chain ID
          const accounts = provider.accounts as Address[]
          const currentChainId = provider.chainId

          // Set up event listeners
          this.setupEventListeners()

          return {
            accounts,
            chainId: currentChainId,
          }
        } catch (error) {
          if (error instanceof UserRejectedRequestError) {
            throw error
          }
          throw new ConnectorNotFoundError()
        }
      },

      async disconnect() {
        if (provider) {
          await provider.disconnect()
          provider = undefined
        }
      },

      async getAccounts() {
        if (!provider) return []
        return provider.accounts as Address[]
      },

      async getChainId() {
        if (!provider) return chains[0].id
        return provider.chainId
      },

      async getProvider() {
        if (!provider) {
          provider = await EthereumProvider.init({
            projectId,
            chains: chains.map((chain) => chain.id),
            showQrModal: false,
            metadata: metadata ?? {
              name: 'Porto App',
              description: 'Porto WalletConnect Integration',
              url: typeof window !== 'undefined' ? window.location.origin : '',
              icons: ['https://avatars.githubusercontent.com/u/37784886?s=200&v=4'],
            },
            qrModalOptions,
            relayUrl,
            rpcMap,
          })
        }
        return provider
      },

      async isAuthorized() {
        if (!provider) return false
        return provider.accounts.length > 0
      },

      async switchChain({ chainId }) {
        if (!provider) throw new ConnectorNotFoundError()

        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: numberToHex(chainId) }],
          })
          return chains.find((chain) => chain.id === chainId)!
        } catch (error) {
          throw new SwitchChainError(error as Error)
        }
      },

      onAccountsChanged(accounts: Address[]) {
        if (accountsChanged) {
          accountsChanged(accounts)
        }
      },

      onChainChanged(chainId: number) {
        if (chainChanged) {
          chainChanged(chainId)
        }
      },

      onConnect(connectInfo: ProviderConnectInfo) {
        if (connect) {
          connect(connectInfo)
        }
      },

      onDisconnect(error: RpcError) {
        if (disconnect) {
          disconnect(error)
        }
      },

      setupEventListeners() {
        if (!provider) return

        // Set up WalletConnect event listeners
        provider.on('accountsChanged', (accounts: string[]) => {
          this.onAccountsChanged(accounts as Address[])
        })

        provider.on('chainChanged', (chainId: number) => {
          this.onChainChanged(chainId)
        })

        provider.on('connect', (connectInfo: ProviderConnectInfo) => {
          this.onConnect(connectInfo)
        })

        provider.on('disconnect', (error: RpcError) => {
          this.onDisconnect(error)
        })
      },
    }
  })
}
