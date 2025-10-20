import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors, useDisconnect } from 'wagmi'

import PWABadge from './pwa-badge.tsx'

export function App() {
  const account = useAccount()

  return (
    <main>
      <h1>PWARTO</h1>
      <p>A Porto example showcasing authentication with SIWE in a PWA</p>
      {account.isConnected ? <Account /> : <SignIn />}
      <Me />
      <PWABadge />
    </main>
  )
}

function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()

  return (
    <div>
      <h2>Account</h2>

      <div>
        account: {account.address}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
      </div>

      {account.status !== 'disconnected' && (
        <button onClick={() => disconnect.disconnect()} type="button">
          Sign out
        </button>
      )}
    </div>
  )
}

function SignIn() {
  const connect = Hooks.useConnect()
  const [connector] = useConnectors()

  return (
    <div>
      <h2>Connect</h2>
      <button
        onClick={() =>
          connect.mutate({
            connector: connector as never,
            signInWithEthereum: {
              authUrl: '/api/siwe',
            },
          })
        }
        type="button"
      >
        Sign in
      </button>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function Me() {
  const [me, setMe] = React.useState<string | null>(null)

  return (
    <div style={{ margin: '20px auto' }}>
      <button
        onClick={() => {
          void fetch('/api/me', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => setMe(JSON.stringify(data, undefined, 2)))
        }}
        type="button"
      >
        Fetch /me (authenticated endpoint)
      </button>
      <pre style={{ textAlign: 'left', width: '100%' }}>{me}</pre>
    </div>
  )
}
