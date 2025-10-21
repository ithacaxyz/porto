import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Hex, Json, Secp256k1 } from 'ox'
import { baseSepolia } from 'porto/core/Chains'
import { Account, Key, RelayActions } from 'porto/viem'
import * as React from 'react'
import { formatEther, parseEther } from 'viem'
import { useReadContract } from 'wagmi'

import { client, permissions } from './config'
import { exp1Address, exp1Config } from './contracts'

export function App() {
  const privy = usePrivy()

  if (!privy.ready) return <div>Loading...</div>
  return <PrivyAccount />
}

function PrivyAccount() {
  const privy = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  )

  const [signatures, setSignatures] =
    React.useState<Array<`0x${string}`> | null>(null)
  const [account, setAccount] =
    React.useState<Account.Account<'privateKey'> | null>(null)
  const [upgradedAccount, setUpgradedAccount] =
    React.useState<RelayActions.upgradeAccount.ReturnType | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [sessionKey, setSessionKey] = React.useState<Key.Key | null>(null)
  const [autoUpgrade, setAutoUpgrade] = React.useState(false)
  const [pendingAutoUpgradeUserId, setPendingAutoUpgradeUserId] =
    React.useState<string | null>(null)
  const lastKnownUserIdRef = React.useRef<string | null>(null)

  const [error, setError] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)
  const [isConfirmed, setIsConfirmed] = React.useState(false)
  const [data, setData] =
    React.useState<RelayActions.sendCalls.ReturnType | null>(null)

  const handleUpgrade = React.useCallback(async () => {
    try {
      if (!embeddedWallet) throw new Error('Embedded wallet not available.')
      if (!privy.user?.wallet?.address)
        throw new Error('Wallet address is not available for this user.')

      setErrorMessage(null)
      setSignatures([])
      setSessionKey(null)

      const policy = permissions()
      const privateKey = Secp256k1.randomPrivateKey()
      const key = Key.fromSecp256k1({
        expiry: policy.expiry,
        feeToken: {
          limit: '10000',
          symbol: policy.feeToken.symbol,
        },
        permissions: policy.permissions,
        privateKey,
        role: 'session',
      })
      console.info(key)
      setSessionKey(key)

      const account = Account.from({
        address: privy.user?.wallet?.address as `0x${string}`,
        keys: [key],
        sign: async (parameters) => {
          console.info(parameters)
          const provider = await embeddedWallet.getEthereumProvider()
          const signature = await provider.request({
            method: 'secp256k1_sign',
            params: [parameters.hash],
          })
          console.info('signature', signature)
          setSignatures((prev) => [...(prev ?? []), signature])

          Hex.assert(signature)

          return signature
        },
        source: 'privateKey',
      })
      console.info(account)
      setAccount(account)

      const upgradedAccount = await RelayActions.upgradeAccount(client, {
        account,
        authorizeKeys: [key],
        chain: baseSepolia,
      })
      setUpgradedAccount(upgradedAccount)

      try {
        await RelayActions.sendCalls(client, {
          account,
          authorizeKeys: [key],
          calls: [],
          chain: baseSepolia,
          // @ts-expect-error
          key: null,
          merchantUrl: '/porto/merchant',
        })
      } catch (error) {
        const primingErrorMessage =
          error instanceof Error
            ? error.message
            : Json.stringify(error, undefined, 2)
        console.error(primingErrorMessage)
        setErrorMessage(primingErrorMessage)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : Json.stringify(error, undefined, 2)
      console.error(errorMessage)
      setErrorMessage(errorMessage)
    }
  }, [embeddedWallet, privy.user])

  React.useEffect(() => {
    const primaryUserId =
      privy.user?.id ??
      privy.user?.wallet?.address ??
      privy.user?.email?.address ??
      null

    const lastUserId = lastKnownUserIdRef.current

    if (primaryUserId !== lastUserId) {
      lastKnownUserIdRef.current = primaryUserId

      if (!primaryUserId) {
        setPendingAutoUpgradeUserId(null)
        return
      }

      if (autoUpgrade) setPendingAutoUpgradeUserId(primaryUserId)
      else setPendingAutoUpgradeUserId(null)

      return
    }

    if (!autoUpgrade && pendingAutoUpgradeUserId) {
      setPendingAutoUpgradeUserId(null)
    }
  }, [autoUpgrade, pendingAutoUpgradeUserId, privy.user])

  React.useEffect(() => {
    if (!autoUpgrade) return
    if (!pendingAutoUpgradeUserId) return

    const currentUserId =
      privy.user?.id ??
      privy.user?.wallet?.address ??
      privy.user?.email?.address ??
      null

    if (!currentUserId) return
    if (currentUserId !== pendingAutoUpgradeUserId) return
    if (!embeddedWallet) return

    let cancelled = false

    const upgrade = async () => {
      try {
        await handleUpgrade()
      } finally {
        if (!cancelled) setPendingAutoUpgradeUserId(null)
      }
    }

    void upgrade()

    return () => {
      cancelled = true
    }
  }, [
    autoUpgrade,
    embeddedWallet,
    handleUpgrade,
    pendingAutoUpgradeUserId,
    privy.user,
  ])
  return (
    <section>
      <div>
        <h2>Privy Account</h2>
        <button
          onClick={async () => {
            if (privy.user) {
              await privy.logout()
              setPendingAutoUpgradeUserId(null)
              lastKnownUserIdRef.current = null
            } else
              privy.login({
                loginMethods: ['passkey', 'email', 'wallet'],
                walletChainType: 'ethereum-only',
              })
          }}
          type="button"
        >
          {privy.user ? 'Logout' : 'Login'}
        </button>
        <label>
          <input
            checked={autoUpgrade}
            onChange={(event) => {
              const { checked } = event.target
              setAutoUpgrade(checked)
              if (!checked) setPendingAutoUpgradeUserId(null)
            }}
            type="checkbox"
          />
          Auto upgrade
        </label>
        <pre>{JSON.stringify(privy.user, null, 2)}</pre>
      </div>
      <div>
        <h2>Upgrade Account</h2>
        <button
          onClick={() => {
            void handleUpgrade()
          }}
          type="button"
        >
          Upgrade Account
        </button>
        {errorMessage && <pre>{errorMessage}</pre>}
        {signatures && <pre>{Json.stringify({ signatures }, null, 2)}</pre>}
        {upgradedAccount && (
          <pre>{Json.stringify(upgradedAccount, null, 2)}</pre>
        )}
      </div>
      {account && (
        <div>
          <h2>Mint EXP</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                console.info(account)
                if (!sessionKey) throw new Error('Session key not ready.')
                const data = await RelayActions.sendCalls(client, {
                  account,
                  calls: [
                    {
                      ...exp1Config,
                      args: [account.address, parseEther('10')],
                      functionName: 'mint',
                      to: exp1Address,
                    },
                  ],
                  chain: baseSepolia,
                  key: sessionKey,
                  merchantUrl: '/porto/merchant',
                })
                setData(data)
                setIsPending(true)
                setIsConfirmed(true)
              } catch (error) {
                console.error(error)
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : Json.stringify(error, undefined, 2)
                setError(errorMessage)
                setIsPending(false)
                setIsConfirmed(false)
              }
            }}
          >
            <button disabled={isPending} type="submit">
              {isPending ? 'Confirming...' : 'Mint 100 EXP'}
            </button>
          </form>
          {data?.id && <div>Transaction Hash: {data.id}</div>}
          {isConfirmed && 'Transaction confirmed.'}
          {error && <pre>{error}</pre>}
        </div>
      )}
      {account && <Balance address={account.address} />}
    </section>
  )
}

function Balance(props: { address: `0x${string}` }) {
  const { data: balance } = useReadContract({
    chainId: baseSepolia.id,
    ...exp1Config,
    args: [props.address],
    functionName: 'balanceOf',
    query: {
      enabled: !!props.address,
      refetchInterval: 2_000,
    },
  })

  return (
    <div>
      <h2>Balance</h2>
      <div>Balance: {formatEther(balance ?? 0n)} EXP</div>
    </div>
  )
}
