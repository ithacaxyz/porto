import { Hooks } from 'porto/wagmi'
import { useState } from 'react'
import {
  type EIP1193Provider,
  formatEther,
  type Hex,
  parseEther,
  stringify,
} from 'viem'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import {
  type BaseError,
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useReadContract,
  useSendCalls,
  useWaitForCallsStatus,
} from 'wagmi'
import { exp1Address, exp1Config } from './contracts'

const key = () =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    permissions: {
      calls: [
        {
          to: exp1Address,
        },
      ],
      spend: [
        {
          limit: parseEther('50'),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

export function App() {
  const { isConnected } = useAccount()
  return (
    <>
      <Account />
      {isConnected ? (
        <>
          <Balance />
          <GrantPermissions />
          <GrantAdmin />
          <Mint />
        </>
      ) : (
        <>
          <Connect />
          <UpgradeAccount />
        </>
      )}
    </>
  )
}

function Account() {
  const account = useAccount()
  const { data: permissions } = Hooks.usePermissions()
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
        <br />
        permissions: {stringify(permissions)}
      </div>

      {account.status !== 'disconnected' && (
        <button onClick={() => disconnect.disconnect()} type="button">
          Log Out
        </button>
      )}
    </div>
  )
}

function Connect() {
  const [grantPermissions, setGrantPermissions] = useState<boolean>(true)

  const connectors = useConnectors()
  const connect = useConnect()

  return (
    <div>
      <h2>Connect</h2>
      <label>
        <input
          checked={grantPermissions}
          onChange={() => setGrantPermissions((x) => !x)}
          type="checkbox"
        />
        Grant Permissions
      </label>
      {connectors
        .filter((x) => x.id === 'xyz.ithaca.porto')
        ?.map((connector) => (
          <div key={connector.uid}>
            <button
              key={connector.uid}
              onClick={() =>
                connect.connect({
                  capabilities: {
                    grantPermissions: grantPermissions ? key() : undefined,
                  },
                  connector,
                })
              }
              type="button"
            >
              Login
            </button>
            <button
              onClick={() =>
                connect.connect({
                  capabilities: {
                    createAccount: true,
                    grantPermissions: grantPermissions ? key() : undefined,
                  },
                  connector,
                })
              }
              type="button"
            >
              Register
            </button>
          </div>
        ))}
      <div>{connect.status}</div>
      <div>{connect.error?.message}</div>
    </div>
  )
}

function UpgradeAccount() {
  const [accountData, setAccountData] = useState<{
    address: string
    privateKey: string
  } | null>(null)
  const [grantPermissions, setGrantPermissions] = useState<boolean>(true)
  const [privateKey, setPrivateKey] = useState<string>('')

  const connectors = useConnectors()
  const upgradeAccount = Hooks.useUpgradeAccount()

  return (
    <div>
      <h2>Upgrade Account</h2>
      <p>
        <button
          onClick={() => {
            const privateKey = generatePrivateKey()
            setPrivateKey(privateKey)
            setAccountData({
              address: privateKeyToAddress(privateKey),
              privateKey,
            })
          }}
          type="button"
        >
          Create EOA
        </button>
        {accountData && <pre>{stringify(accountData, null, 2)}</pre>}
      </p>
      <div>
        <input
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private Key"
          style={{ width: '300px' }}
          type="text"
          value={privateKey}
        />
      </div>
      <div>
        <label>
          <input
            checked={grantPermissions}
            onChange={() => setGrantPermissions((x) => !x)}
            type="checkbox"
          />
          Grant Permissions
        </label>
      </div>
      {connectors
        .filter((x) => x.id === 'xyz.ithaca.porto')
        ?.map((connector) => (
          <button
            key={connector.uid}
            onClick={() =>
              upgradeAccount.mutate({
                account: privateKeyToAccount(privateKey as Hex),
                connector,
                grantPermissions: grantPermissions ? key() : undefined,
              })
            }
            type="button"
          >
            Upgrade EOA to Porto Account
          </button>
        ))}
      <div>{upgradeAccount.status}</div>
      <div>{upgradeAccount.error?.message}</div>
    </div>
  )
}

function Balance() {
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    ...exp1Config,
    args: [address!],
    functionName: 'balanceOf',
    query: {
      enabled: !!address,
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

function GrantPermissions() {
  const permissions = Hooks.usePermissions()
  const grantPermissions = Hooks.useGrantPermissions()

  return (
    <div>
      <h2>Permissions</h2>
      <pre>{stringify(permissions.data, null, 2)}</pre>
      <h2>Grant Permissions</h2>
      <button onClick={() => grantPermissions.mutate(key())} type="button">
        Grant Permissions
      </button>
      {grantPermissions.data && <div>Permissions granted.</div>}
      {grantPermissions.error && (
        <div>
          Error:{' '}
          {grantPermissions.error.shortMessage ||
            grantPermissions.error.message}
        </div>
      )}
    </div>
  )
}

function GrantAdmin() {
  const connectors = useConnectors()
  const admins = Hooks.useAdmins()
  const grantAdmin = Hooks.useGrantAdmin()

  return (
    <div>
      <h2>Admins</h2>
      <pre>{stringify(admins.data, null, 2)}</pre>
      <h2>Grant Admin</h2>
      {connectors?.map((connector) => (
        <button
          key={connector.uid}
          onClick={async () => {
            const provider = (await connector.getProvider()) as EIP1193Provider
            const [address] = await provider.request({
              method: 'eth_requestAccounts',
            })
            grantAdmin.mutate({
              key: {
                publicKey: address!,
                type: 'address',
              },
            })
          }}
          type="button"
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}

function Mint() {
  const { address } = useAccount()
  const { data, error, isPending, sendCalls } = useSendCalls()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForCallsStatus({
      id: data?.id,
    })

  return (
    <div>
      <h2>Mint EXP</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendCalls({
            calls: [
              {
                ...exp1Config,
                args: [address!, parseEther('100')],
                functionName: 'mint',
                to: exp1Address,
              },
            ],
          })
        }}
      >
        <button disabled={isPending} type="submit">
          {isPending ? 'Confirming...' : 'Mint 100 EXP'}
        </button>
      </form>
      {data?.id && <div>Transaction Hash: {data.id}</div>}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}
