import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Address } from 'ox'
import type { Hex } from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import type * as Messenger from 'porto/core/Messenger'
import * as Account from 'porto/viem/Account'
import * as React from 'react'
import * as Dialog from './Dialog'
import { porto } from './Porto'

export type GuestStatus = 'disabled' | 'enabled' | 'signing-in' | 'signing-up'

export function useGuestMode(currentAccount?: Account.Account) {
  const [guestStatus, setGuestStatus] = React.useState<GuestStatus>('disabled')
  const queryClient = useQueryClient()

  const guestModeAccount = useQuery({
    enabled: !currentAccount,
    async queryFn() {
      const { storage } = porto._internal.config
      let pk = await storage.getItem<Hex>('porto.guestMode.key')

      // only generate new key if none exists (may have funds)
      if (!pk) {
        pk = Secp256k1.randomPrivateKey()
        await storage.setItem('porto.guestMode.key', pk)
        queryClient.invalidateQueries({ queryKey: ['guestMode', 'hasKey'] })
      }

      return Account.fromPrivateKey(pk)
    },
    queryKey: ['guestMode', 'account'],
    staleTime: Number.POSITIVE_INFINITY,
  })

  React.useEffect(() => {
    if (currentAccount) return
    if (!guestModeAccount.data) return
    porto._internal.store.setState((state) => ({
      ...state,
      accounts: [guestModeAccount.data],
    }))
  }, [guestModeAccount.data, currentAccount])

  if (guestModeAccount.data && guestStatus === 'disabled')
    setGuestStatus('enabled')

  const skipStaleCheck = React.useRef(false)
  React.useEffect(() => {
    if (currentAccount) {
      skipStaleCheck.current = false
      return
    }

    if (skipStaleCheck.current) return
    if (guestModeAccount.isFetching) return

    // keep dialogs in sync e.g. to use the iframe after signup in popup
    skipStaleCheck.current = true
    const { getItem } = porto._internal.config.storage
    void Promise.resolve(getItem<Hex>('porto.guestMode.key')).then(
      (key) => {
        // no key in storage but have cached guest => guest was upgraded
        if (!key && guestModeAccount.data)
          queryClient.invalidateQueries({ queryKey: ['guestMode'] })
      },
      (err) => {
        console.error('Failed to check guest mode key:', err)
      },
    )
  }, [
    currentAccount,
    guestModeAccount.data,
    guestModeAccount.isFetching,
    queryClient,
  ])

  const handleGuestSignIn = React.useCallback(async () => {
    setGuestStatus('signing-in')
    try {
      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [{}],
      })
      const newAccount = response.accounts?.[0]
      if (newAccount) {
        porto.messenger.send('account', {
          account: newAccount as Messenger.Payload<'account'>['account'],
        })
        setGuestStatus('disabled')
        queryClient.invalidateQueries({ queryKey: ['guestMode'] })
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [queryClient.invalidateQueries])

  const handleGuestSignUp = React.useCallback(
    async (email?: string) => {
      setGuestStatus('signing-up')
      try {
        const storage = porto._internal.config.storage

        // get stored ephemeral private key
        const key = await storage.getItem<Hex>('porto.guestMode.key')
        if (!key) throw new Error('No ephemeral account found')

        // call wallet_connect with ephemeral eoa to upgrade it with WebAuthn
        const response = await porto.provider.request({
          method: 'wallet_connect',
          params: [
            {
              capabilities: {
                createAccount: {
                  eoa: key,
                  label: email,
                },
                email: Boolean(email),
              },
            },
          ],
        })

        const newAccount = response.accounts?.[0]
        if (newAccount) {
          porto.messenger.send('account', {
            account: newAccount as Messenger.Payload<'account'>['account'],
          })
          setGuestStatus('disabled')

          // guest was upgraded => delete ephemeral key
          await storage.removeItem('porto.guestMode.key')

          queryClient.invalidateQueries({ queryKey: ['guestMode'] })
        }
      } catch (error) {
        console.error('Failed to upgrade ephemeral account:', error)
        if (Dialog.handleWebAuthnIframeError(error)) return
        setGuestStatus('enabled')
      }
    },
    [queryClient.invalidateQueries],
  )

  const hasGuestKeyQuery = useQuery({
    async queryFn() {
      const { storage } = porto._internal.config
      const key = await storage.getItem('porto.guestMode.key')
      return Boolean(key)
    },
    queryKey: ['guestMode', 'hasKey'],
  })

  const addressesMatch = Boolean(
    guestModeAccount.data &&
      currentAccount &&
      Address.isEqual(currentAccount.address, guestModeAccount.data.address),
  )

  // ephemeral = non-persistent but connected guest account
  // i.e. current account matches guest key and key exists in storage
  const isEphemeral = hasGuestKeyQuery.isLoading
    ? addressesMatch
    : Boolean(hasGuestKeyQuery.data && addressesMatch)

  return {
    account: guestModeAccount.data,
    isEphemeral,
    onSignIn: handleGuestSignIn,
    onSignUp: handleGuestSignUp,
    status: guestStatus,
  }
}
