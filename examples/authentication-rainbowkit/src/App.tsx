import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <ConnectButton />
      {isConnected && <Account />}
      <Me />
    </>
  )
}

function Account() {
  const account = useAccount()

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
