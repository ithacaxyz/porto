import { exp1Abi, exp1Address, exp2Address } from '@porto/apps/contracts'
import {
  AbiFunction,
  Hex,
  Json,
  P256,
  PublicKey,
  Signature,
  Siwe,
  TypedData,
  Value,
} from 'ox'
import { Chains, Dialog, Implementation, Porto } from 'porto'
import { getClient } from 'porto/core/internal/porto'
import * as React from 'react'
import { http } from 'viem'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { verifyMessage, verifyTypedData } from 'viem/actions'

const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    permissions: {
      calls: [
        {
          to: exp1Address,
        },
        {
          to: exp2Address,
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('50')),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

const host = import.meta.env.VITE_DIALOG_HOST + window.location.search
const implementations = {
  local: Implementation.local(),
  'iframe-dialog': Implementation.dialog({
    host,
  }),
  'popup-dialog': Implementation.dialog({
    host,
    renderer: Dialog.popup(),
  }),
  'inline-dialog': Implementation.dialog({
    host,
    renderer: Dialog.experimental_inline({
      element: () => document.getElementById('porto')!,
    }),
  }),
}
type ImplementationType = keyof typeof implementations

const searchParams = new URLSearchParams(window.location.search)
const relay = searchParams.get('relay') !== null

const porto = Porto.create({
  // We will be deferring implementation setup until after hydration.
  implementation: null,
  transports: relay
    ? {
        [Chains.odysseyTestnet.id]: {
          default: http(),
          relay: http('https://relay-staging.ithaca.xyz'),
        },
      }
    : undefined,
})

export function App() {
  const [implementation, setImplementation] =
    React.useState<ImplementationType>('iframe-dialog')
  React.useEffect(
    () => porto._internal.setImplementation(implementations[implementation]),
    [implementation],
  )

  return (
    <>
      <div className="max-w-[768px] p-2">
        <h1>Playground</h1>
        <div className="flex gap-2">
          Implementation:
          <select
            onChange={(e) =>
              setImplementation(e.target.value as ImplementationType)
            }
            value={implementation}
          >
            <option value="iframe-dialog">Dialog (iframe)</option>
            <option value="popup-dialog">Dialog (popup)</option>
            <option value="inline-dialog">Dialog (inline)</option>
            <option value="local">Local</option>
          </select>
        </div>
        <hr />
        <State />
        <Events />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Account Management</h2>
        <Connect />
        <Login />
        <Register />
        <Accounts />
        <Disconnect />
        <UpgradeAccount />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Permissions</h2>
        <GrantPermissions />
        <GetPermissions />
        <RevokePermissions />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Actions</h2>
        <SendCalls />
        <SendTransaction />
        <SignMessage />
        <SignTypedData />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>App-managed Signing</h2>
        <GrantKeyPermissions />
        <PrepareCalls />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Misc.</h2>
        <GetCapabilities />
      </div>
      <div className="fixed top-0 left-[calc(768px+var(--spacing)*2)] p-4">
        <div id="porto" />
      </div>
    </>
  )
}

function State() {
  const state = React.useSyncExternalStore(
    porto._internal.store.subscribe,
    () => porto._internal.store.getState(),
    () => porto._internal.store.getState(),
  )
  return (
    <div>
      <h3>State</h3>
      {state.accounts.length === 0 ? (
        <p>Disconnected</p>
      ) : (
        <>
          <p>Address: {state.accounts[0].address}</p>
          <p>Chain ID: {state.chain.id}</p>
          <p>
            Keys:{' '}
            <pre>{Json.stringify(state.accounts?.[0]?.keys, null, 2)}</pre>
          </p>
        </>
      )}
    </div>
  )
}

function Events() {
  const [responses, setResponses] = React.useState<Record<string, unknown>>({})
  React.useEffect(() => {
    const handleResponse = (event: string) => (response: unknown) =>
      setResponses((responses) => ({
        ...responses,
        [event]: response,
      }))

    const handleAccountsChanged = handleResponse('accountsChanged')
    const handleChainChanged = handleResponse('chainChanged')
    const handleConnect = handleResponse('connect')
    const handleDisconnect = handleResponse('disconnect')
    const handleMessage = handleResponse('message')

    porto.provider.on('accountsChanged', handleAccountsChanged)
    porto.provider.on('chainChanged', handleChainChanged)
    porto.provider.on('connect', handleConnect)
    porto.provider.on('disconnect', handleDisconnect)
    porto.provider.on('message', handleMessage)
    return () => {
      porto.provider.removeListener('accountsChanged', handleAccountsChanged)
      porto.provider.removeListener('chainChanged', handleChainChanged)
      porto.provider.removeListener('connect', handleConnect)
      porto.provider.removeListener('disconnect', handleDisconnect)
      porto.provider.removeListener('message', handleMessage)
    }
  }, [])

  return (
    <div>
      <h3>Events</h3>
      <pre>{JSON.stringify(responses, null, 2)}</pre>
    </div>
  )
}

function Connect() {
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(true)
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <div>
      <h3>wallet_connect</h3>
      <label>
        <input
          type="checkbox"
          checked={grantPermissions}
          onChange={() => setGrantPermissions((x) => !x)}
        />
        Grant Permissions
      </label>
      <div>
        <button
          onClick={() =>
            porto.provider
              .request({
                method: 'wallet_connect',
                params: [
                  {
                    capabilities: {
                      grantPermissions: grantPermissions
                        ? permissions()
                        : undefined,
                    },
                  },
                ],
              })
              .then(setResult)
          }
          type="button"
        >
          Login
        </button>
        <button
          onClick={() =>
            porto.provider
              .request({
                method: 'wallet_connect',
                params: [
                  {
                    capabilities: {
                      grantPermissions: grantPermissions
                        ? permissions()
                        : undefined,
                      createAccount: true,
                    },
                  },
                ],
              })
              .then(setResult)
          }
          type="button"
        >
          Register
        </button>
      </div>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function Accounts() {
  const [result, setResult] = React.useState<readonly string[] | null>(null)
  return (
    <div>
      <h3>eth_accounts</h3>
      <button
        onClick={() =>
          porto.provider.request({ method: 'eth_accounts' }).then(setResult)
        }
        type="button"
      >
        Get Accounts
      </button>
      <pre>{result}</pre>
    </div>
  )
}

function Register() {
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <div>
      <h3>experimental_createAccount</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_createAccount' })
            .then(setResult)
        }
        type="button"
      >
        Register
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function Login() {
  const [result, setResult] = React.useState<readonly string[] | null>(null)
  return (
    <div>
      <h3>eth_requestAccounts</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'eth_requestAccounts' })
            .then(setResult)
        }
        type="button"
      >
        Login
      </button>
      <pre>{result}</pre>
    </div>
  )
}

function Disconnect() {
  return (
    <div>
      <h3>wallet_disconnect</h3>
      <button
        onClick={() => porto.provider.request({ method: 'wallet_disconnect' })}
        type="button"
      >
        Disconnect
      </button>
    </div>
  )
}

function GetCapabilities() {
  const [result, setResult] = React.useState<Record<string, unknown> | null>(
    null,
  )
  return (
    <div>
      <h3>wallet_getCapabilities</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'wallet_getCapabilities' })
            .then(setResult)
        }
        type="button"
      >
        Get Capabilities
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function GrantPermissions() {
  const [result, setResult] = React.useState<any | null>(null)
  return (
    <div>
      <h3>experimental_grantPermissions</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const result = await porto.provider.request({
            method: 'experimental_grantPermissions',
            params: [permissions()],
          })
          setResult(result)
        }}
      >
        <button type="submit">Grant Permissions</button>
      </form>
      {result && <pre>permissions: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

function RevokePermissions() {
  const [revoked, setRevoked] = React.useState(false)
  return (
    <div>
      <h3>experimental_revokePermissions</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const id = formData.get('id') as `0x${string}`

          setRevoked(false)
          await porto.provider.request({
            method: 'experimental_revokePermissions',
            params: [{ id }],
          })
          setRevoked(true)
        }}
      >
        <input name="id" placeholder="Permissions ID (0x...)" type="text" />
        <button type="submit">Revoke Permissions</button>
      </form>
      {revoked && <p>Permissions revoked.</p>}
    </div>
  )
}

function GetPermissions() {
  const [result, setResult] = React.useState<unknown>(null)

  return (
    <div>
      <h3>experimental_permissions</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_permissions' })
            .then(setResult)
        }
        type="button"
      >
        Get Permissions
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function UpgradeAccount() {
  const [accountData, setAccountData] = React.useState<{
    address: string
    privateKey: string
  } | null>(null)
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(true)
  const [privateKey, setPrivateKey] = React.useState<string>('')
  const [result, setResult] = React.useState<unknown | null>(null)

  return (
    <div>
      <h3>experimental_upgradeAccount</h3>
      <p>
        <button
          onClick={() => {
            const privateKey = generatePrivateKey()
            setPrivateKey(privateKey)
            setAccountData({
              privateKey,
              address: privateKeyToAddress(privateKey),
            })
          }}
          type="button"
        >
          Create EOA
        </button>
        {accountData && <pre>{JSON.stringify(accountData, null, 2)}</pre>}
      </p>
      <div>
        <input
          type="text"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private Key"
          style={{ width: '300px' }}
        />
      </div>
      <label>
        <input
          type="checkbox"
          checked={grantPermissions}
          onChange={() => setGrantPermissions((x) => !x)}
        />
        Grant Permissions
      </label>
      <div>
        <button
          onClick={async () => {
            const account = privateKeyToAccount(privateKey as Hex.Hex)

            const { context, signPayloads } = await porto.provider.request({
              method: 'experimental_prepareUpgradeAccount',
              params: [
                {
                  address: account.address,
                  capabilities: {
                    grantPermissions: grantPermissions
                      ? permissions()
                      : undefined,
                  },
                },
              ],
            })

            const signatures = await Promise.all(
              signPayloads.map((hash) => account.sign({ hash })),
            )

            const address = await porto.provider.request({
              method: 'experimental_upgradeAccount',
              params: [{ context, signatures }],
            })
            setResult(address)
          }}
          type="button"
        >
          Upgrade EOA to Porto Account
        </button>
      </div>
      {result ? (
        <p>
          Upgraded account. <pre>{JSON.stringify(result, null, 2)}</pre>
        </p>
      ) : null}
    </div>
  )
}

function SendCalls() {
  const [hash, setHash] = React.useState<string | null>(null)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const action = formData.get('action') as string | null
        const address = formData.get('address') as `0x${string}` | null

        const result = await porto.provider.request({
          method: 'eth_accounts',
        })
        const account = address || result[0]!

        const calls = (() => {
          if (action === 'mint')
            return [
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
            ]

          if (action === 'transfer')
            return [
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [account, Value.fromEther('50')],
                ),
              },
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    account,
                    '0x0000000000000000000000000000000000000000',
                    Value.fromEther('50'),
                  ],
                ),
              },
            ] as const

          if (action === 'mint-transfer')
            return [
              {
                to: exp2Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [account, Value.fromEther('50')],
                ),
              },
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    account,
                    '0x0000000000000000000000000000000000000000',
                    Value.fromEther('50'),
                  ],
                ),
              },
            ] as const

          if (action === 'revert')
            return [
              {
                to: exp2Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    '0x0000000000000000000000000000000000000000',
                    account,
                    Value.fromEther('100'),
                  ],
                ),
              },
            ] as const

          return [
            {
              to: '0x0000000000000000000000000000000000000000',
              value: '0x0',
            },
            {
              to: '0x0000000000000000000000000000000000000000',
              value: '0x0',
            },
          ] as const
        })()

        const hash = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls,
              from: account,
              version: '1',
            },
          ],
        })
        setHash(hash)
      }}
    >
      <h3>wallet_sendCalls</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select name="action">
          <option value="mint">Mint 100 EXP</option>
          <option value="transfer">Transfer 50 EXP</option>
          <option value="mint-transfer">Mint 100 EXP2 + Transfer 50 EXP</option>
          <option value="revert">Revert</option>
          <option value="noop">Noop Calls</option>
        </select>
        <input name="address" placeholder="address" type="text" />
        <button type="submit">Send</button>
      </div>
      {hash && (
        <>
          <pre>{hash}</pre>
          <a
            href={`https://odyssey-explorer.ithaca.xyz/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </>
      )}
    </form>
  )
}

function SendTransaction() {
  const [hash, setHash] = React.useState<Hex.Hex | null>(null)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        const action = formData.get('action') as string | null

        const [account] = await porto.provider.request({
          method: 'eth_accounts',
        })

        const params = (() => {
          if (action === 'mint')
            return [
              {
                from: account,
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
            ] as const

          return [
            {
              from: account,
              to: '0x0000000000000000000000000000000000000000',
              value: '0x0',
            },
          ] as const
        })() as any

        const hash = await porto.provider.request({
          method: 'eth_sendTransaction',
          params,
        })
        setHash(hash)
      }}
    >
      <h3>eth_sendTransaction</h3>
      <select name="action">
        <option value="mint">Mint 100 EXP</option>
        <option value="noop">Noop</option>
      </select>
      <button type="submit">Send</button>
      {hash && (
        <>
          <pre>{hash}</pre>
          <a
            href={`https://odyssey-explorer.ithaca.xyz/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </>
      )}
    </form>
  )
}

function SignMessage() {
  const [signature, setSignature] = React.useState<string | null>(null)
  const [valid, setValid] = React.useState<boolean | null>(null)

  return (
    <>
      <h3>personal_sign</h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const formData = new FormData(e.target as HTMLFormElement)
          const message = formData.get('message') as string

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const result = await porto.provider.request({
            method: 'personal_sign',
            params: [Hex.fromString(message), account],
          })
          setSignature(result)
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <input defaultValue="hello world" name="message" />
          <button type="submit">Sign</button>
        </div>
      </form>

      <div style={{ height: '8px' }} />

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const chainId = await porto.provider.request({
            method: 'eth_chainId',
          })
          const message = Siwe.createMessage({
            address: account,
            chainId: Number(chainId),
            domain: 'localhost',
            nonce: 'deadbeef',
            uri: 'https://localhost:5173/',
            version: '1',
          })
          const signature = await porto.provider.request({
            method: 'personal_sign',
            params: [Hex.fromString(message), account],
          })
          setSignature(signature)
        }}
      >
        <button type="submit">Sign in with Ethereum</button>
      </form>

      <pre
        style={{
          maxWidth: '500px',
          overflowWrap: 'anywhere',
          // @ts-expect-error
          textWrapMode: 'wrap',
        }}
      >
        {signature}
      </pre>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const message = formData.get('message') as string
          const signature = formData.get('signature') as `0x${string}`

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })

          const valid = await verifyMessage(getClient(porto), {
            address: account,
            message,
            signature,
          })
          setValid(valid)
        }}
      >
        <div>
          <input name="message" placeholder="message" />
        </div>
        <div>
          <textarea name="signature" placeholder="signature" />
        </div>
        <button type="submit">Verify</button>
        {valid !== null && <pre>{valid ? 'valid' : 'invalid'}</pre>}
      </form>
    </>
  )
}

function SignTypedData() {
  const [signature, setSignature] = React.useState<string | null>(null)
  const [valid, setValid] = React.useState<boolean | null>(null)

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const result = await porto.provider.request({
            method: 'eth_signTypedData_v4',
            params: [account, TypedData.serialize(typedData)],
          })
          setSignature(result)
        }}
      >
        <h3>eth_signTypedData_v4</h3>
        <button type="submit">Sign</button>
        <pre
          style={{
            maxWidth: '500px',
            overflowWrap: 'anywhere',
            // @ts-expect-error
            textWrapMode: 'wrap',
          }}
        >
          {signature}
        </pre>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const signature = formData.get('signature') as `0x${string}`

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })

          const valid = await verifyTypedData(getClient(porto), {
            ...typedData,
            address: account,
            signature,
          })
          setValid(valid)
        }}
      >
        <div>
          <textarea name="signature" placeholder="signature" />
        </div>
        <button type="submit">Verify</button>
        {valid !== null && <pre>{valid ? 'valid' : 'invalid'}</pre>}
      </form>
    </>
  )
}

let keyPair: {
  publicKey: Hex.Hex
  privateKey: Hex.Hex
} | null = null

function GrantKeyPermissions() {
  const [result, setResult] = React.useState<any | null>(null)
  return (
    <div>
      <button
        onClick={async () => {
          const privateKey = P256.randomPrivateKey()
          const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
            includePrefix: false,
          })

          keyPair = { publicKey, privateKey }

          const result = await porto.provider.request({
            method: 'experimental_grantPermissions',
            params: [
              {
                key: { type: 'p256', publicKey },
                ...permissions(),
              },
            ],
          })
          setResult(result)
        }}
        type="button"
      >
        Create Key & Grant Permissions
      </button>
      {result && <pre>permissions: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

function PrepareCalls() {
  const [hash, setHash] = React.useState<string | null>(null)
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const action = formData.get('action') as string | null

        const [account] = await porto.provider.request({
          method: 'eth_accounts',
        })

        const calls = (() => {
          if (action === 'mint')
            return [
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
            ]

          if (action === 'transfer')
            return [
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [account, Value.fromEther('50')],
                ),
              },
              {
                to: exp1Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    account,
                    '0x0000000000000000000000000000000000000000',
                    Value.fromEther('50'),
                  ],
                ),
              },
            ] as const

          if (action === 'revert')
            return [
              {
                to: exp2Address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    '0x0000000000000000000000000000000000000000',
                    account,
                    Value.fromEther('100'),
                  ],
                ),
              },
            ] as const

          return [
            {
              to: '0x0000000000000000000000000000000000000000',
              value: '0x0',
            },
            {
              to: '0x0000000000000000000000000000000000000000',
              value: '0x0',
            },
          ] as const
        })()

        if (!keyPair) throw new Error('create key first.')

        const { digest, ...request } = await porto.provider.request({
          method: 'wallet_prepareCalls',
          params: [
            {
              calls,
              chainId: Hex.fromNumber(Chains.odysseyTestnet.id),
              key: {
                type: 'p256',
                publicKey: keyPair.publicKey,
              },
            },
          ],
        })

        const signature = Signature.toHex(
          P256.sign({
            payload: digest,
            privateKey: keyPair.privateKey,
          }),
        )

        const [{ id: hash }] = await porto.provider.request({
          method: 'wallet_sendPreparedCalls',
          params: [
            {
              ...request,
              signature,
            },
          ],
        })
        setHash(hash)
      }}
    >
      <h3>wallet_prepareCalls → P256.sign → wallet_sendPreparedCalls</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select name="action">
          <option value="mint">Mint 100 EXP</option>
          <option value="transfer">Transfer 50 EXP</option>
        </select>
        <button type="submit">Sign & Send</button>
      </div>
      {hash && (
        <>
          <pre>{hash}</pre>
          <a
            href={`https://odyssey-explorer.ithaca.xyz/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            Explorer
          </a>
        </>
      )}
    </form>
  )
}

const typedData = {
  domain: {
    name: 'Ether Mail 🥵',
    version: '1.1.1',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  },
  types: {
    Name: [
      { name: 'first', type: 'string' },
      { name: 'last', type: 'string' },
    ],
    Person: [
      { name: 'name', type: 'Name' },
      { name: 'wallet', type: 'address' },
      { name: 'favoriteColors', type: 'string[3]' },
      { name: 'foo', type: 'uint256' },
      { name: 'age', type: 'uint8' },
      { name: 'isCool', type: 'bool' },
    ],
    Mail: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
      { name: 'hash', type: 'bytes' },
    ],
  },
  primaryType: 'Mail',
  message: {
    timestamp: 1234567890n,
    contents: 'Hello, Bob! 🖤',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: {
      name: {
        first: 'Cow',
        last: 'Burns',
      },
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      age: 69,
      foo: 123123123123123123n,
      favoriteColors: ['red', 'green', 'blue'],
      isCool: false,
    },
    to: {
      name: { first: 'Bob', last: 'Builder' },
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      age: 70,
      foo: 123123123123123123n,
      favoriteColors: ['orange', 'yellow', 'green'],
      isCool: true,
    },
  },
} as const
