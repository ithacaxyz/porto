import { EthereumProvider } from '@walletconnect/ethereum-provider'
import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as RpcRequest from 'ox/RpcRequest'
import * as z from 'zod/mini'
import type * as Account from '../../viem/Account.js'
import type * as Chains from '../../core/Chains.js'
import type * as Mode from '../../core/internal/mode.js'
import type * as PermissionsRequest from '../../core/internal/schema/permissionsRequest.js'
import type * as RpcSchema from '../../core/RpcSchema.js'
import * as Mode_ from '../../core/internal/mode.js'

export type WalletConnectV2ModeParameters = {
  /** Project ID from WalletConnect Cloud */
  projectId: string
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

export function walletConnectV2Mode(parameters: WalletConnectV2ModeParameters) {
  const { projectId, metadata, qrModalOptions, relayUrl, rpcMap } = parameters

  let provider: EthereumProvider | undefined

  return Mode_.from({
    name: 'walletconnect-v2',
    actions: {
      async createAccount(parameters) {
        const { internal } = parameters
        const { client, config } = internal

        // Initialize WalletConnect provider if not already done
        if (!provider) {
          provider = await EthereumProvider.init({
            projectId,
            chains: [client.chain.id],
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

        // Connect to WalletConnect
        await provider.connect()

        // Get the first account
        const address = provider.accounts[0] as Address.Address
        if (!address) {
          throw new Error('No accounts found')
        }

        // Create a basic account object
        const account: Account.Account = {
          address,
          type: 'walletConnect',
        }

        return { account }
      },

      async connect(parameters) {
        const { internal } = parameters
        const { client } = internal

        // Initialize WalletConnect provider if not already done
        if (!provider) {
          provider = await EthereumProvider.init({
            projectId,
            chains: [client.chain.id],
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

        // Connect to WalletConnect
        await provider.connect()

        // Get accounts
        const accounts = provider.accounts as Address.Address[]

        return { accounts }
      },

      async signMessage(parameters) {
        const { internal, message } = parameters
        const { client } = internal

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Sign message using WalletConnect
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, provider.accounts[0]],
        })

        return signature as Hex.Hex
      },

      async sendTransaction(parameters) {
        const { internal, transaction } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Send transaction using WalletConnect
        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transaction],
        })

        return hash as Hex.Hex
      },

      async switchChain(parameters) {
        const { internal, chainId } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Switch chain using WalletConnect
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      },

      async getAccountVersion(parameters) {
        const { address } = parameters

        // For WalletConnect, we'll return a default version
        return {
          current: '1.0.0',
          latest: '1.0.0',
        }
      },

      async getAssets(parameters) {
        const { internal } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Get assets using WalletConnect
        const assets = await provider.request({
          method: 'wallet_getAssets',
          params: [],
        })

        return assets as any
      },

      async prepareCalls(parameters) {
        const { internal, calls } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Prepare calls using WalletConnect
        const preparedCalls = await provider.request({
          method: 'wallet_prepareCalls',
          params: [calls],
        })

        return preparedCalls as any
      },

      async sendCalls(parameters) {
        const { internal, calls } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Send calls using WalletConnect
        const result = await provider.request({
          method: 'wallet_sendCalls',
          params: [calls],
        })

        return result as any
      },

      async signTypedData(parameters) {
        const { internal, typedData } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Sign typed data using WalletConnect
        const signature = await provider.request({
          method: 'eth_signTypedData_v4',
          params: [provider.accounts[0], typedData],
        })

        return signature as Hex.Hex
      },

      async upgradeAccount(parameters) {
        const { internal, account, context, signatures } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Upgrade account using WalletConnect
        const upgradedAccount = await provider.request({
          method: 'wallet_upgradeAccount',
          params: [account, context, signatures],
        })

        return { account: upgradedAccount as Account.Account }
      },

      async verifyEmail(parameters) {
        const { internal, account, chainId, email, token, walletAddress } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Verify email using WalletConnect
        await provider.request({
          method: 'wallet_verifyEmail',
          params: [account, chainId, email, token, walletAddress],
        })

        return null
      },

      async addFunds(parameters) {
        const { internal, address, token, value } = parameters

        if (!provider) {
          throw new Error('WalletConnect provider not initialized')
        }

        // Add funds using WalletConnect
        const result = await provider.request({
          method: 'wallet_addFunds',
          params: [address, token, value],
        })

        return result as any
      },
    },

    setup(internal) {
      // Setup WalletConnect provider
      const setupProvider = async () => {
        if (!provider) {
          provider = await EthereumProvider.init({
            projectId,
            chains: internal.config.chains.map((chain) => chain.id),
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
      }

      setupProvider()

      // Return cleanup function
      return () => {
        if (provider) {
          provider.disconnect()
          provider = undefined
        }
      }
    },
  })
}
