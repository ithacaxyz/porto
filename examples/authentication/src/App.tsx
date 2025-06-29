import { Hooks } from 'porto/wagmi'
import { useState } from 'react'
import { useAccount, useChainId, useConnectors, useDisconnect } from 'wagmi'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      {isConnected ? <Account /> : <SignIn />}
      <Me />
    </>
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
        <button
          onClick={() => {
            fetch('/api/logout', { credentials: 'include' })
            disconnect.disconnect()
          }}
          type="button"
        >
          Sign out
        </button>
      )}
    </div>
  )
}

function SignIn() {
  const chainId = useChainId()
  const connect = Hooks.useConnect()
  const [connector] = useConnectors()

  return (
    <div>
      <h2>Connect</h2>
      <button
        onClick={async () => {
          // Fetch SIWE nonce.
          const nonce = await fetch('/api/nonce').then((res) => res.text())

          // Connect + sign SIWE message.
          const result = await connect.mutateAsync({
            connector,
            signInWithEthereum: {
              chainId,
              nonce,
            },
          })

          // Authenticate with server.
          const siwe = result.accounts.at(0)?.capabilities?.signInWithEthereum!
          await fetch('/api/auth', {
            body: JSON.stringify({
              message: siwe.message,
              signature: siwe.signature,
            }),
            method: 'POST',
          })
        }}
        type="button"
      >
        Sign in
      </button>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function Me() {
  const [me, setMe] = useState<string | null>(null)

  return (
    <div>
      <button
        onClick={() => {
          fetch('/api/me', { credentials: 'include' })
            .then((res) => res.text())
            .then((data) => setMe(data))
        }}
        type="button"
      >
        Fetch /me (authenticated endpoint)
      </button>
      <div>{me}</div>
    </div>
  )
}
