import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function App() {
  const account = useAccount()
  const disconnect = useDisconnect()
  const connect = useConnect()
  return (
    <main>
      <h1>Porto Theming Example</h1>
      <p>
        This example uses the Porto connector with a custom theme, which can be
        found in <code>src/config.ts</code>.<br />
        See the{' '}
        <a
          href="https://porto.sh/sdk/guides/theming"
          rel="noopener noreferrer"
          target="_blank"
        >
          Porto Theming Guide
        </a>{' '}
        for more details.
      </p>
      <div>
        {account.isConnected ? (
          <button onClick={() => disconnect.disconnect()} type="button">
            Sign out
          </button>
        ) : (
          <button
            onClick={() =>
              connect.connect({
                connector: connect.connectors[0],
              })
            }
            type="button"
          >
            Sign in
          </button>
        )}
      </div>
      {connect.error && <div>Error: {connect.error?.message}</div>}
    </main>
  )
}
