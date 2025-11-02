import type * as Messenger from 'porto/core/Messenger'
import type { Account } from 'porto/viem'
import * as React from 'react'
import * as Dialog from './Dialog'
import { porto } from './Porto'

export type GuestStatus = 'disabled' | 'enabled' | 'signing-in' | 'signing-up'

export function useGuestMode(currentAccount?: Account.Account) {
  const [guestModeAccount, setGuestModeAccount] =
    React.useState<Account.Account>()
  const [guestStatus, setGuestStatus] = React.useState<GuestStatus>('disabled')

  React.useEffect(() => {
    if (!currentAccount && !guestModeAccount) setGuestStatus('enabled')
  }, [currentAccount, guestModeAccount])

  const handleGuestSignIn = React.useCallback(async () => {
    setGuestStatus('signing-in')
    try {
      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [{}],
      })
      const newAccount = response.accounts?.[0]
      const [portoAccount] = porto._internal.store.getState().accounts
      if (newAccount && portoAccount) {
        setGuestModeAccount(portoAccount)
        porto.messenger.send('account', {
          account: newAccount as Messenger.Payload<'account'>['account'],
        })
        setGuestStatus('disabled')
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [])

  const handleGuestSignUp = React.useCallback(async (email?: string) => {
    setGuestStatus('signing-up')
    try {
      const response = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: email ? { label: email } : true,
              email: Boolean(email),
            },
          },
        ],
      })
      const newAccount = response.accounts?.[0]
      const [portoAccount] = porto._internal.store.getState().accounts
      if (newAccount && portoAccount) {
        setGuestModeAccount(portoAccount)
        porto.messenger.send('account', {
          account: newAccount as Messenger.Payload<'account'>['account'],
        })
        setGuestStatus('disabled')
      }
    } catch (error) {
      if (Dialog.handleWebAuthnIframeError(error)) return
      setGuestStatus('enabled')
    }
  }, [])

  return {
    guestModeAccount,
    guestStatus,
    onSignIn: handleGuestSignIn,
    onSignUp: handleGuestSignUp,
  }
}
