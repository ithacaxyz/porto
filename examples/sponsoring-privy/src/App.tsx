import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { useQuery } from '@tanstack/react-query'
import { Address, Hex, Json, Secp256k1 } from 'ox'
import { baseSepolia } from 'porto/core/Chains'
import { Account, Key, RelayActions } from 'porto/viem'
import * as React from 'react'
import { parseEther } from 'viem'
import { useAccount, useWaitForCallsStatus } from 'wagmi'

import { permissions, client as relayClient } from './config'
import { exp1Address, exp1Config } from './contracts'

export function App() {
  const privy = usePrivy()

  if (!privy.ready) return <div>Loading...</div>
  return (
    <main>
      <ConnectOrCreate />
      <UpgradeAccount />
      <SponsoredMint />
    </main>
  )
}

function ConnectOrCreate() {
  const privy = usePrivy()
  const wallet = useWallet()

  if (!wallet) return null

  return (
    <div>
      <h2>Account</h2>
      <button
        onClick={async () => {
          if (privy.user) return await privy.logout()

          return privy.login({
            loginMethods: ['wallet', 'passkey', 'farcaster', 'email'],
            walletChainType: 'ethereum-only',
          })
        }}
        type="button"
      >
        {privy.user ? 'Logout' : 'Connect or Create'}
      </button>
      {wallet.embedded && (
        <pre>
          {JSON.stringify(
            {
              embedded: wallet.embedded,
              selectedWallet: {
                addresses: wallet.selected.addresses,
                chainId: wallet.selected.chainId,
                status: wallet.selected.status,
              },
            },
            null,
            2,
          )}
        </pre>
      )}
    </div>
  )
}

function useSessionKey() {
  return useQuery({
    queryFn: () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const key = Key.fromSecp256k1({
        ...permissions(),
        privateKey,
        role: 'session',
      })
      return { key, privateKey }
    },
    queryKey: ['sessionKey'],
  })
}

function usePortoFromPrivyAccount() {
  const wallet = useWallet()
  const sessionKey = useSessionKey()

  return useQuery({
    enabled:
      !!sessionKey.data?.key &&
      !!wallet.embedded &&
      Address.validate(wallet.embedded.address),
    queryFn: () =>
      Account.from({
        address: wallet.embedded?.address as `0x${string}`,
        keys: [sessionKey.data?.key as Key.Key],
        sign: async (parameters) => {
          if (!wallet.embedded)
            throw new Error('Embedded wallet not available.')
          const provider = await wallet.embedded.getEthereumProvider()
          const signature = await provider.request({
            method: 'secp256k1_sign',
            params: [parameters.hash],
          })
          Hex.assert(signature)
          return signature
        },
        source: 'privateKey',
      }),
    queryKey: ['porto-from-privy-account', wallet.embedded?.address],
  })
}

function useUpgradePortoFromPrivyAccount() {
  const privy = usePrivy()
  const wallet = useWallet()
  const sessionKey = useSessionKey()

  const [upgradedAccount, setUpgradedAccount] =
    React.useState<RelayActions.upgradeAccount.ReturnType | null>(null)

  const [error, setError] = React.useState<string | null>(null)

  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const account = usePortoFromPrivyAccount()

  async function upgradeAccount() {
    setStatus('loading')
    try {
      if (!account.data) throw new Error('Account not available.')
      if (!sessionKey.data?.key) throw new Error('Session key not available.')

      const upgradedAccount = await RelayActions.upgradeAccount(relayClient, {
        account: account.data,
        authorizeKeys: [sessionKey.data.key],
        chain: baseSepolia,
      })

      // propagate session key on-chain
      void (await RelayActions.sendCalls(relayClient, {
        account: account.data,
        authorizeKeys: [sessionKey.data.key],
        calls: [],
        chain: baseSepolia,
        // @ts-expect-error
        key: null,
        merchantUrl: '/porto/merchant',
      }))

      setUpgradedAccount(upgradedAccount)
      setStatus('success')
      return upgradedAccount
    } catch (error) {
      setStatus('error')
      const errorMessage =
        error instanceof Error
          ? error.message
          : Json.stringify(error, undefined, 2)
      console.error(errorMessage)
      setError(errorMessage)
    }
  }

  if (!sessionKey.data?.key) return undefined
  if (!privy.user?.wallet?.address) return undefined
  if (!wallet.embedded || !Address.validate(wallet.embedded.address))
    return undefined

  return { error, status, upgradeAccount, upgradedAccount }
}

function UpgradeAccount() {
  const portoFromPrivy = useUpgradePortoFromPrivyAccount()

  if (!portoFromPrivy) return null

  return (
    <div>
      <h2>Upgrade Account</h2>
      <button onClick={portoFromPrivy.upgradeAccount} type="button">
        Upgrade Account
      </button>
      {portoFromPrivy.status === 'loading' && <pre>Loading...</pre>}
      {portoFromPrivy.status === 'success' && <pre>Success</pre>}
      {portoFromPrivy.status === 'error' && (
        <pre>Error: {portoFromPrivy.error}</pre>
      )}
      {portoFromPrivy.error && <pre>Error: {portoFromPrivy.error}</pre>}
      {portoFromPrivy.upgradedAccount && (
        <pre>{Json.stringify(portoFromPrivy.upgradedAccount, null, 2)}</pre>
      )}
    </div>
  )
}

function SponsoredMint() {
  const wallet = useWallet()
  const sessionKey = useSessionKey()
  const account = usePortoFromPrivyAccount()

  const [id, setId] = React.useState<Hex.Hex | undefined>(undefined)

  const callStatus = useWaitForCallsStatus({
    id,
    query: { enabled: !!id },
  })

  if (!account.data) return null

  return (
    <div>
      <h2>Sponsored Mint</h2>
      <button
        disabled={
          callStatus.isLoading || !account.data || !sessionKey.data?.key
        }
        onClick={async () => {
          if (!account.data) throw new Error('Account not available.')
          if (!sessionKey.data?.key)
            throw new Error('Session key not available.')
          const result = await RelayActions.sendCalls(relayClient, {
            account: account.data,
            calls: [
              {
                ...exp1Config,
                args: [account.data.address, parseEther('100')],
                functionName: 'mint',
                to: exp1Address,
              },
            ],
            chain: wallet.selected.chain,
            key: sessionKey.data.key,
            merchantUrl: '/porto/merchant',
          })
          setId(result.id)
        }}
        type="button"
      >
        mint 100 EXP
      </button>
      {id && <pre>{Json.stringify({ bundleId: id }, null, 2)}</pre>}
      {callStatus.isSuccess && <pre>Transaction confirmed.</pre>}
      {callStatus.isLoading && <pre>Waiting for confirmation...</pre>}
      {callStatus.isError && <pre>Error: {callStatus.error?.message}</pre>}
      {callStatus.data?.receipts?.at(0)?.transactionHash && (
        <pre>
          Transaction Hash: {callStatus.data.receipts.at(0)?.transactionHash}
        </pre>
      )}
    </div>
  )
}

function useWallet() {
  const { wallets: allWallets } = useWallets()
  const selected = useAccount()
  const embedded = allWallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  )
  const { setActiveWallet } = useSetActiveWallet()

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  React.useEffect(() => {
    const wallet = allWallets.at(0)
    if (allWallets.length > 0 && !selected.address && wallet)
      void setActiveWallet(wallet)
  }, [allWallets, selected.address])

  return { all: allWallets, embedded, selected }
}
