import {
  AbiFunction,
  AbiParameters,
  Address,
  Hash,
  Hex,
  Json,
  PublicKey,
  TypedData,
  Value,
} from 'ox'
import { Porto } from 'porto'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { createClient, custom } from 'viem'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { verifyMessage, verifyTypedData } from 'viem/actions'

import { zklogin } from '@shield-labs/zklogin'
import { serializeKeys } from '../../src/internal/accountDelegation'
import { ExperimentERC20 } from './contracts'

const porto = Porto.create()

const client = createClient({
  transport: custom(porto.provider),
})
const zkLogin = new zklogin.ZkLogin()
const authProvider = new zklogin.GoogleProvider(
  import.meta.env.VITE_GOOGLE_CLIENT_ID,
)

export function App() {
  useEffect(() => {
    ;(async () => {
      if (window.location.pathname.startsWith('/auth')) {
        try {
          await authProvider.handleRedirect()
        } finally {
          window.location.href = '/'
        }
      }
    })()
  })
  return (
    <div>
      <State />
      <Events />
      <Connect />
      <Register />
      <ImportAccount />
      <Login />
      <Disconnect />
      <AddBackup />
      <Recover />
      <Accounts />
      <GetCapabilities />
      <GrantSession />
      <GetSessions />
      <SendCalls />
      <SendTransaction />
      <SignMessage />
      <SignTypedData />
    </div>
  )
}

function State() {
  const state = useSyncExternalStore(
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
            <pre>
              {Json.stringify(
                state.accounts?.[0]?.keys
                  .filter((x) => x.status === 'unlocked')
                  .map((x) => ({
                    expiry: x.expiry,
                    publicKey: PublicKey.toHex(x.publicKey),
                    status: x.status,
                    type: x.type,
                  })),
                null,
                2,
              )}
            </pre>
          </p>
        </>
      )}
    </div>
  )
}

function Events() {
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  useEffect(() => {
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
  const [grantSession, setGrantSession] = useState<boolean>(true)
  const [result, setResult] = useState<unknown | null>(null)
  return (
    <div>
      <h3>experimental_connect</h3>
      <label>
        <input
          type="checkbox"
          checked={grantSession}
          onChange={() => setGrantSession((x) => !x)}
        />
        Grant Session
      </label>
      <div>
        <button
          onClick={() =>
            porto.provider
              .request({
                method: 'experimental_connect',
                params: [{ capabilities: { grantSession } }],
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
                method: 'experimental_connect',
                params: [
                  { capabilities: { createAccount: true, grantSession } },
                ],
              })
              .then(setResult)
          }
          type="button"
        >
          Register
        </button>
      </div>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}

function Accounts() {
  const [result, setResult] = useState<readonly string[] | null>(null)
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
  const [result, setResult] = useState<string | null>(null)
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
      <pre>{result}</pre>
    </div>
  )
}

function Login() {
  const [result, setResult] = useState<readonly string[] | null>(null)
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
      <h3>experimental_disconnect</h3>
      <button
        onClick={() =>
          porto.provider.request({ method: 'experimental_disconnect' })
        }
        type="button"
      >
        Disconnect
      </button>
    </div>
  )
}

function AddBackup() {
  const [result, setResult] = useState<string | undefined>()
  const [jwt, setJwt] = useState<string | undefined>() // TODO: use tanstack query
  const [updateCounter, setUpdateCounter] = useState(0)
  useEffect(() => {
    updateCounter // trigger re-fetch
    ;(async () => {
      const jwt = await authProvider.getJwt()
      setJwt(jwt)
    })()
  }, [updateCounter])

  return (
    <div>
      <h3>experimental_addBackup</h3>
      <p>Logged in: {String(!!jwt)}</p>
      {!jwt ? (
        <button
          type="button"
          onClick={async () => {
            await authProvider.signInWithRedirect({ nonce: 'anything' })
          }}
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={async () => {
              await authProvider.signOut()
              setUpdateCounter((x) => x + 1)
            }}
          >
            Sign out of Google
          </button>
          <button
            onClick={async () => {
              const jwt = await authProvider.getJwt()
              if (!jwt) {
                await authProvider.signInWithRedirect({ nonce: 'anything' })
                return
              }
              const [account] = await porto.provider.request({
                method: 'eth_accounts',
              })
              return porto.provider
                .request({
                  method: 'experimental_addBackup',
                  params: [
                    {
                      address: account!,
                      backupOptions: [
                        {
                          type: 'zkLogin',
                          provider: 'google',
                          jwt,
                        },
                      ],
                    },
                  ],
                })
                .then(setResult)
            }}
            type="button"
          >
            Add Backup
          </button>
          <pre>{result}</pre>
        </>
      )}
    </div>
  )
}

function Recover() {
  const state = useSyncExternalStore(
    porto._internal.store.subscribe,
    () => porto._internal.store.getState(),
    () => porto._internal.store.getState(),
  )
  const [result, setResult] = useState<string | undefined>()
  return (
    <div>
      <h3>experimental_recover</h3>
      <button
        onClick={async () => {
          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const newKey = state.accounts.find((acc) =>
            Address.isEqual(acc.address, account),
          )?.keys[0]
          if (!newKey) {
            throw new Error('key not found')
          }
          const expectedNonce = Hash.keccak256(
            AbiParameters.encode(
              AbiParameters.from([
                'struct PublicKey { uint256 x; uint256 y; }',
                'struct Key { uint256 expiry; uint8 keyType; PublicKey publicKey; }',
                'Key key',
              ]),
              [serializeKeys([newKey])[0]!],
            ),
          ).slice('0x'.length)
          const jwt = await authProvider.getJwt()
          if (!jwt) {
            await authProvider.signInWithRedirect({ nonce: expectedNonce })
            return
          }
          const proof = await zkLogin.proveJwt(jwt, expectedNonce)
          if (!proof) {
            console.error('jwt invalid or expired')
            await authProvider.signInWithRedirect({ nonce: expectedNonce })
            return
          }
          return porto.provider
            .request({
              method: 'experimental_recover',
              params: [
                {
                  address: account!,
                  backupOption: {
                    type: 'zkLogin',
                    provider: 'google',
                    proof,
                  },
                  newAuthentication: {
                    key: { publicKey: PublicKey.toHex(newKey.publicKey) },
                  },
                },
              ],
            })
            .then(setResult)
        }}
        type="button"
      >
        Recover
      </button>
      <pre>{result}</pre>
    </div>
  )
}

function GetCapabilities() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
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
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}

function GrantSession() {
  const [result, setResult] = useState<Hex.Hex | null>(null)
  return (
    <div>
      <h3>experimental_grantSession</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const expiry = Number(formData.get('expiry'))

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          const { id } = await porto.provider.request({
            method: 'experimental_grantSession',
            params: [
              {
                address: account,
                expiry: Math.floor(Date.now() / 1000) + expiry,
              },
            ],
          })
          setResult(id)
        }}
      >
        <input
          required
          placeholder="expiry (seconds)"
          name="expiry"
          type="number"
        />
        <button type="submit">Grant Session</button>
      </form>
      {result && <pre>session id: {result}</pre>}
    </div>
  )
}

function GetSessions() {
  const [result, setResult] = useState<unknown>(null)

  return (
    <div>
      <h3>experimental_sessions</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'experimental_sessions' })
            .then(setResult)
        }
        type="button"
      >
        Get Sessions
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function ImportAccount() {
  const [accountData, setAccountData] = useState<{
    address: string
    privateKey: string
  } | null>(null)
  const [grantSession, setGrantSession] = useState<boolean>(true)
  const [privateKey, setPrivateKey] = useState<string>('')
  const [result, setResult] = useState<unknown | null>(null)

  return (
    <div>
      <h3>experimental_importAccount</h3>
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
          Create Account
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
          checked={grantSession}
          onChange={() => setGrantSession((x) => !x)}
        />
        Grant Session
      </label>
      <div>
        <button
          onClick={async () => {
            const account = privateKeyToAccount(privateKey as Hex.Hex)

            const { context, signPayloads } = await porto.provider.request({
              method: 'experimental_prepareImportAccount',
              params: [
                { address: account.address, capabilities: { grantSession } },
              ],
            })

            const signatures = await Promise.all(
              signPayloads.map((hash) => account.sign({ hash })),
            )

            const address = await porto.provider.request({
              method: 'experimental_importAccount',
              params: [{ context, signatures }],
            })
            setResult(address)
          }}
          type="button"
        >
          Import Account
        </button>
      </div>
      {result ? (
        <p>
          Imported account. <pre>{JSON.stringify(result, null, 2)}</pre>
        </p>
      ) : null}
    </div>
  )
}

function SendCalls() {
  const [hash, setHash] = useState<string | null>(null)
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
                to: ExperimentERC20.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
            ]

          if (action === 'approve-transfer')
            return [
              {
                to: ExperimentERC20.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(ExperimentERC20.abi, 'approve'),
                  [account, Value.fromEther('50')],
                ),
              },
              {
                to: ExperimentERC20.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(ExperimentERC20.abi, 'transferFrom'),
                  [
                    account,
                    '0x0000000000000000000000000000000000000000',
                    Value.fromEther('50'),
                  ],
                ),
              },
            ] as const

          return [
            {
              data: '0xdeadbeef',
              to: '0x0000000000000000000000000000000000000000',
            },
            {
              data: '0xcafebabe',
              to: '0x0000000000000000000000000000000000000000',
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
          <option value="approve-transfer">Approve + Transfer 50 EXP</option>
          <option value="noop">Noop Calls</option>
        </select>
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
  const [hash, setHash] = useState<Hex.Hex | null>(null)
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
                to: ExperimentERC20.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
              },
            ] as const

          return [
            {
              from: account,
              to: '0x0000000000000000000000000000000000000000',
              data: '0xdeadbeef',
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
  const [signature, setSignature] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  return (
    <>
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
        <h3>personal_sign</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input defaultValue="hello world" name="message" />
          <button type="submit">Sign</button>
        </div>
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
          const message = formData.get('message') as string
          const signature = formData.get('signature') as `0x${string}`

          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })

          const valid = await verifyMessage(client, {
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
  const [signature, setSignature] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

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

          const valid = await verifyTypedData(client, {
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
