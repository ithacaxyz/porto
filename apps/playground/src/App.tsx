import { Env } from '@porto/apps'
import { ChainIcon } from '@porto/apps/components'
import {
  exp1Abi,
  exp1Address,
  exp2Abi,
  exp2Address,
  expNftAbi,
  expNftAddress,
} from '@porto/apps/contracts'
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
import { Dialog } from 'porto'
import * as React from 'react'
import { hashTypedData, isAddress, isHex, maxUint256 } from 'viem'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'
import { verifyHash, verifyMessage } from 'viem/actions'
import {
  type ChainId,
  client,
  isDialogModeType,
  type ModeType,
  mipd,
  modes,
  permissions,
  porto,
  type ThemeType,
  themes,
} from './config'

export function App() {
  const [mode, setMode] = React.useState<ModeType>(() => {
    const url = new URL(window.location.href)
    const mode = url.searchParams.get('mode') as ModeType | null

    if (!mode) return 'iframe-dialog'
    if (mode in modes) return mode

    const err = `Invalid mode: ${mode}.\nValid modes: ${Object.keys(modes).join(', ')}.`
    alert(err)
    throw new Error(err)
  })

  const [options, setOptions] = React.useState<{
    theme: ThemeType
  }>({
    theme: 'default',
  })

  const themeRef = React.useRef<{
    controller: ReturnType<typeof Dialog.createThemeController> | null
    theme: ThemeType
  }>({ controller: null, theme: options.theme })

  // update mode
  React.useEffect(() => {
    if (!isDialogModeType(mode)) {
      porto._internal.setMode(modes[mode]())
      themeRef.current.controller = null
      return
    }

    themeRef.current.controller = Dialog.createThemeController()
    porto._internal.setMode(
      modes[mode]({
        theme: themes[themeRef.current.theme],
        themeController: themeRef.current.controller,
      }),
    )
  }, [mode])

  // update theme
  React.useEffect(() => {
    const theme = themes[options.theme]
    if (!theme) return
    themeRef.current.theme = options.theme
    themeRef.current.controller?.setTheme(theme)
  }, [options.theme])

  return (
    <main className="flex w-full overflow-auto">
      <div className="max-w-[768px] p-2">
        <h1>Playground</h1>

        <div className="flex gap-2">
          Mode:
          <select
            onChange={(e) => setMode(e.target.value as ModeType)}
            value={mode}
          >
            <option value="iframe-dialog">Dialog (iframe)</option>
            <option value="popup-dialog">Dialog (popup)</option>
            <option value="page-dialog">Dialog (page)</option>
            <option value="inline-dialog">Dialog (inline)</option>
            <option value="rpc">Relay</option>
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

        <h2>Options</h2>
        <Theme
          onChange={(theme) => setOptions((o) => ({ ...o, theme }))}
          theme={options.theme}
        />
        <div>
          <br />
          <hr />
          <br />
        </div>

        <h2>Account Management</h2>
        <Connect />
        <Login />
        <AddFunds />
        <GetAssets />
        <Accounts />
        <Disconnect />
        <UpgradeAccount />
        <GetAccountVersion />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Chain Management</h2>
        <SwitchChain showTitle />
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
        <h2>Admins</h2>
        <GrantAdmin />
        <GetAdmins />
        <RevokeAdmin />
        <div>
          <br />
          <hr />
          <br />
        </div>
        <h2>Actions</h2>
        <SendCalls />
        <SendTransaction />
        <SignMessage />
        <SignTypedMessage />
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
        <div>
          <br />
          <hr />
        </div>
        <ShowClientCapabilities />
      </div>
      {mode === 'inline-dialog' && (
        <div className="fixed top-0 bottom-0 left-[calc(768px+var(--spacing)*2)] w-[362px] p-4">
          <div
            className="h-full overflow-hidden rounded-md border border-th_frame"
            id="porto"
          />
        </div>
      )}
    </main>
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
        <div>Disconnected</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div>Address: {state.accounts[0].address}</div>
          <div>Chain ID: {state.chainIds[0]}</div>
          <SwitchChain />
          <div>
            <div>Keys:</div>
            <pre className="whitespace-pre-wrap break-all">
              {Json.stringify(state.accounts?.[0]?.keys, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function Events() {
  const [responses, setResponses] = React.useState<Record<string, unknown[]>>(
    {},
  )
  React.useEffect(() => {
    const handleResponse = (event: string) => (response: unknown) =>
      setResponses((responses) => ({
        ...responses,
        [event]: [...(responses[event] ?? []), response],
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
  const [email, setEmail] = React.useState<boolean>(true)
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(false)
  const [siwe, setSiwe] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <div>
      <h3>wallet_connect</h3>
      <div>
        <button
          onClick={async () => {
            const chainId = Hex.toNumber(
              await porto.provider.request({
                method: 'eth_chainId',
              }),
            ) as ChainId
            const payload = {
              capabilities: {
                createAccount: false,
                email,
                grantPermissions: grantPermissions
                  ? permissions({ chainId })
                  : undefined,
                signInWithEthereum: await siwePayload(siwe),
              },
            } as const
            return porto.provider
              .request({
                method: 'wallet_connect',
                params: [payload],
              })
              .then(setResult)
              .catch((error) => {
                console.info(payload)
                console.error(error)
                setError(
                  Json.stringify({ error: error.message, payload }, null, 2),
                )
              })
          }}
          type="button"
        >
          Login
        </button>
        <button
          onClick={async () => {
            const chainId = Hex.toNumber(
              await porto.provider.request({
                method: 'eth_chainId',
              }),
            ) as ChainId
            const payload = {
              capabilities: {
                createAccount: true,
                email,
                grantPermissions: grantPermissions
                  ? permissions({ chainId })
                  : undefined,
                signInWithEthereum: await siwePayload(siwe),
              },
            } as const

            return porto.provider
              .request({
                method: 'wallet_connect',
                params: [payload],
              })
              .then(setResult)
              .catch((error) => {
                console.info(payload)
                console.error(error)
                setError(
                  Json.stringify({ error: error.message, payload }, null, 2),
                )
              })
          }}
          type="button"
        >
          Register
        </button>
      </div>
      <div>
        <label>
          <input
            checked={email}
            onChange={() => setEmail((x) => !x)}
            type="checkbox"
          />
          Email
        </label>
        <label>
          <input
            checked={grantPermissions}
            onChange={() => setGrantPermissions((x) => !x)}
            type="checkbox"
          />
          Grant Permissions
        </label>
        <label>
          <input
            checked={siwe}
            onChange={() => setSiwe((x) => !x)}
            type="checkbox"
          />
          Sign in with Ethereum
        </label>
      </div>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
      {error ? <pre>{error}</pre> : null}
    </div>
  )
}

async function siwePayload(enabled: boolean) {
  if (!enabled) return undefined
  const chainId = await porto.provider.request({
    method: 'eth_chainId',
  })
  return {
    chainId: Number(chainId),
    nonce: 'deadbeef',
  } as const
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

function AddFunds() {
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <div>
      <h3>wallet_addFunds</h3>
      <button
        onClick={async () => {
          const chainId = Hex.toNumber(
            await porto.provider.request({
              method: 'eth_chainId',
            }),
          ) as ChainId
          const token = exp1Address[chainId as never]
          if (!token)
            throw new Error(`exp1 address not defined for chainId ${chainId}`)
          porto.provider
            .request({
              method: 'wallet_addFunds',
              params: [
                {
                  value: Env.get() === 'prod' ? '30' : '100',
                },
              ],
            })
            .then(setResult)
        }}
        type="button"
      >
        Add Funds
      </button>
      {result && typeof result === 'object' && 'id' in result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : null}
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

function GetAccountVersion() {
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <div>
      <h3>wallet_getAccountVersion</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'wallet_getAccountVersion' })
            .then(setResult)
        }
        type="button"
      >
        Get Account Version
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
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
        Get Capabilities (all)
      </button>
      <button
        onClick={async () => {
          const chainId = await porto.provider.request({
            method: 'eth_chainId',
          })
          porto.provider
            .request({
              method: 'wallet_getCapabilities',
              params: [undefined, [chainId]],
            })
            .then(setResult)
        }}
        type="button"
      >
        Get Capabilities (current chain)
      </button>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function GetAssets() {
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const account = await (async () => {
            if (formData.get('account'))
              return formData.get('account') as `0x${string}`
            const [address] = await porto.provider.request({
              method: 'eth_accounts',
            })
            return address
          })()
          porto.provider
            .request({
              method: 'wallet_getAssets',
              params: [{ account }],
            })
            .then(setResult)
        }}
      >
        <h3>wallet_getAssets</h3>
        <input name="account" placeholder="Account" type="text" />
        <button type="submit">Get Assets</button>
      </form>
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  )
}

function GrantPermissions() {
  const [result, setResult] = React.useState<any | null>(null)
  return (
    <div>
      <h3>wallet_grantPermissions</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const chainId = Hex.toNumber(
            await porto.provider.request({
              method: 'eth_chainId',
            }),
          ) as ChainId
          const p = permissions({ chainId })
          if (!p) {
            console.warn(`no permissions to grant for chainId ${chainId}`)
            return
          }
          const result = await porto.provider.request({
            method: 'wallet_grantPermissions',
            params: [p],
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
      <h3>wallet_revokePermissions</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const id = formData.get('id') as `0x${string}`

          setRevoked(false)
          await porto.provider.request({
            method: 'wallet_revokePermissions',
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
      <h3>wallet_getPermissions</h3>
      <button
        onClick={() =>
          porto.provider
            .request({ method: 'wallet_getPermissions' })
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

function GrantAdmin() {
  const providers = React.useSyncExternalStore(
    mipd.subscribe,
    mipd.getProviders,
    mipd.getProviders,
  )
  const [result, setResult] = React.useState<any | null>(null)
  return (
    <div>
      <h3>wallet_grantAdmin</h3>
      {providers.map(({ info, provider }) => (
        <button
          key={info.uuid}
          onClick={async () => {
            const [address] = await provider.request({
              method: 'eth_requestAccounts',
            })
            const result = await porto.provider.request({
              method: 'wallet_grantAdmin',
              params: [
                {
                  key: {
                    publicKey: address,
                    type: 'address',
                  },
                },
              ],
            })
            setResult(result)
          }}
          type="button"
        >
          {info.name}
        </button>
      ))}
      {result && <pre>result: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

function GetAdmins() {
  const [result, setResult] = React.useState<any | null>(null)
  return (
    <div>
      <h3>wallet_getAdmins</h3>
      <button
        onClick={() => {
          porto.provider.request({ method: 'wallet_getAdmins' }).then(setResult)
        }}
        type="button"
      >
        Get Admins
      </button>
      {result && <pre>result: {JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}

function RevokeAdmin() {
  const [revoked, setRevoked] = React.useState(false)
  return (
    <div>
      <h3>wallet_revokeAdmin</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const id = formData.get('id') as `0x${string}`

          setRevoked(false)
          await porto.provider.request({
            method: 'wallet_revokeAdmin',
            params: [{ id }],
          })
          setRevoked(true)
        }}
      >
        <input name="id" placeholder="Admin ID (0x...)" type="text" />
        <button type="submit">Revoke Admin</button>
      </form>
      {revoked && <p>Admin revoked.</p>}
    </div>
  )
}

function SwitchChain(props: { showTitle?: boolean }) {
  const [chainId, setChainId] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    const onChainChanged = (chainId: string) => {
      if (isHex(chainId)) setChainId(Hex.toNumber(chainId))
    }
    porto.provider.request({ method: 'eth_chainId' }).then(onChainChanged)
    porto.provider.on('chainChanged', onChainChanged)
    return () => porto.provider.removeListener('chainChanged', onChainChanged)
  }, [])

  return (
    <div>
      {props.showTitle && <h3>wallet_switchEthereumChain</h3>}
      <div className="flex flex-wrap gap-2">
        {[...porto.config.chains]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((chain) => (
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-th_frame px-2 py-1 disabled:opacity-50"
              disabled={chainId === undefined || chainId === chain.id}
              key={chain.id}
              onClick={() => {
                porto.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: Hex.fromNumber(chain.id) }],
                })
              }}
              type="button"
            >
              <ChainIcon chainId={chain.id} className="h-3 w-3" /> {chain.name}
            </button>
          ))}
      </div>
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
      <h3>wallet_upgradeAccount</h3>
      <div>
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
        {accountData && <pre>{JSON.stringify(accountData, null, 2)}</pre>}
      </div>
      <div>
        <input
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private Key"
          style={{ width: '300px' }}
          type="text"
          value={privateKey}
        />
      </div>
      <label>
        <input
          checked={grantPermissions}
          onChange={() => setGrantPermissions((x) => !x)}
          type="checkbox"
        />
        Grant Permissions
      </label>
      <div>
        <button
          onClick={async () => {
            const account = privateKeyToAccount(privateKey as Hex.Hex)

            const chainId = Hex.toNumber(
              await porto.provider.request({
                method: 'eth_chainId',
              }),
            ) as ChainId
            const { context, digests } = await porto.provider.request({
              method: 'wallet_prepareUpgradeAccount',
              params: [
                {
                  address: account.address,
                  capabilities: {
                    grantPermissions: grantPermissions
                      ? permissions({ chainId })
                      : undefined,
                  },
                },
              ],
            })

            const signatures = {
              auth: await account.sign({ hash: digests.auth }),
              exec: await account.sign({ hash: digests.exec }),
            }

            const address = await porto.provider.request({
              method: 'wallet_upgradeAccount',
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
        <div>
          <p>Upgraded account.</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  )
}

function SendCalls() {
  const [id, setId] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<{} | null>(null)

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
        const chainId = Hex.toNumber(
          await porto.provider.request({
            method: 'eth_chainId',
          }),
        )

        if (!isExpChainId(chainId)) {
          alert(`unsupported chainId: ${chainId}`)
          throw new Error(`exp1 address not defined for chainId ${chainId}`)
        }

        const account = result[0]
        const recipient = address || account

        const params = (() => {
          if (action === 'mint')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'mint'),
                    [recipient, Value.fromEther('100')],
                  ),
                  to: exp1Address[chainId],
                },
              ],
            } as const

          if (action === 'swap-exp1')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'swap'),
                    [exp2Address[chainId], recipient, Value.fromEther('10')],
                  ),
                  to: exp1Address[chainId],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '10',
                  },
                ],
              },
            } as const

          if (action === 'swap-exp2')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp2Abi, 'swap'),
                    [exp1Address[chainId], recipient, Value.fromEther('0.1')],
                  ),
                  to: exp2Address[chainId],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP2',
                    value: '0.1',
                  },
                ],
              },
            } as const

          if (action === 'approve')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'approve'),
                    [recipient, Value.fromEther('50')],
                  ),
                  to: exp1Address[chainId],
                },
              ],
            } as const

          if (action === 'transfer')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'approve'),
                    [account, Value.fromEther('50')],
                  ),
                  to: exp1Address[chainId],
                },
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                    [
                      account,
                      address || '0x0000000000000000000000000000000000000000',
                      Value.fromEther('50'),
                    ],
                  ),
                  to: exp1Address[chainId],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '50',
                  },
                ],
              },
            } as const

          if (action === 'send')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'transfer'),
                    [
                      address || '0x0000000000000000000000000000000000000000',
                      Value.fromEther('12.34'),
                    ],
                  ),
                  to: exp1Address[chainId],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '12.34',
                  },
                ],
              },
            } as const

          if (action === 'mint-transfer')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'mint'),
                    [recipient, Value.fromEther('100')],
                  ),
                  to: exp2Address[chainId],
                },
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'approve'),
                    [expNftAddress[chainId as never], Value.fromEther('10')],
                  ),
                  to: exp1Address[chainId],
                },
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(expNftAbi, 'mint'),
                  ),
                  to: expNftAddress[chainId as never],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '10',
                  },
                ],
              },
            } as const

          if (action === 'revert')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                    [
                      '0x0000000000000000000000000000000000000000',
                      recipient,
                      Value.fromEther('100'),
                    ],
                  ),
                  to: exp2Address[chainId],
                },
              ],
            } as const

          if (action === 'mint-nft')
            return {
              calls: [
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Abi, 'approve'),
                    [expNftAddress[chainId as never], Value.fromEther('10')],
                  ),
                  to: exp1Address[chainId],
                },
                {
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(expNftAbi, 'mint'),
                  ),
                  to: expNftAddress[chainId as never],
                },
              ],
              capabilities: {
                requiredFunds: [
                  {
                    symbol: 'EXP',
                    value: '10',
                  },
                ],
              },
            } as const

          return {
            calls: [
              {
                to: recipient,
                value: '0x0',
              },
            ],
          } as const
        })()

        const { id } = await porto.provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              ...params,
              from: account,
              version: '1',
            },
          ],
        })
        setId(id)
      }}
    >
      <h3>wallet_sendCalls</h3>

      <div className="flex flex-wrap gap-2">
        <select name="action">
          <option value="mint">Mint 100 EXP</option>
          <option value="swap-exp1">Swap 10 EXP for 0.1 EXP2</option>
          <option value="swap-exp2">Swap 0.1 EXP2 for 10 EXP</option>
          <option value="approve">Approve 50 EXP</option>
          <option value="transfer">Transfer 50 EXP</option>
          <option value="send">Send 12.34 EXP</option>
          <option value="mint-transfer">Mint 100 EXP2 + Mint NFT</option>
          <option value="mint-nft">Mint NFT</option>
          <option value="revert">Revert</option>
          <option value="noop">Noop Calls</option>
        </select>
        <input name="address" placeholder="address" type="text" />
        <button type="submit">Send</button>
      </div>
      {id && (
        <>
          <pre>{id}</pre>

          <br />

          <button
            onClick={async () => {
              const status = await porto.provider.request({
                method: 'wallet_getCallsStatus',
                params: [id as `0x${string}`],
              })
              setStatus(status)
            }}
            type="button"
          >
            Get status
          </button>

          {status && <pre>{JSON.stringify(status, null, 2)}</pre>}
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

        const chainId = Hex.toNumber(
          await porto.provider.request({
            method: 'eth_chainId',
          }),
        ) as ChainId

        const params = (() => {
          if (action === 'mint') {
            const token = exp1Address[chainId as never]
            if (!token)
              throw new Error(`exp1 address not defined for chainId ${chainId}`)
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
                from: account,
                to: token,
              },
            ] as const
          }

          if (action === 'approve') {
            const token = exp1Address[chainId as never]
            if (!token)
              throw new Error(`exp1 address not defined for chainId ${chainId}`)
            const spender = '0x1234567890123456789012345678901234567890'
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [spender, Value.fromEther('50')],
                ),
                from: account,
                to: token,
              },
            ] as const
          }

          if (action === 'approve-infinite') {
            const token = exp1Address[chainId as never]
            if (!token)
              throw new Error(`exp1 address not defined for chainId ${chainId}`)
            const spender = '0x1234567890123456789012345678901234567890'
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [spender, maxUint256],
                ),
                from: account,
                to: token,
              },
            ] as const
          }

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
        <option value="approve">Approve 50 EXP</option>
        <option value="approve-infinite">Approve Infinite EXP</option>
        <option value="noop">Noop</option>
      </select>
      <button type="submit">Send</button>
      {hash && <pre>{hash}</pre>}
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

function SignTypedMessage() {
  const [error, setError] = React.useState<string | null>(null)
  const [typedMessage, setTypedMessage] = React.useState<null | {
    hash: `0x${string}`
    signature: `0x${string}`
  }>(null)
  const [verifyStatus, setVerifyStatus] = React.useState<
    null | 'verifying' | 'valid' | 'invalid'
  >(null)

  const signMessage = async (message: string, hash: `0x${string}`) => {
    const [account] = await porto.provider.request({
      method: 'eth_accounts',
    })
    const signature = await porto.provider.request({
      method: 'eth_signTypedData_v4',
      params: [account, message],
    })
    return { hash, signature }
  }

  const signPermit = async ({
    deadline,
    spender,
    value,
  }: {
    deadline: bigint
    spender: null | `0x${string}`
    value: bigint
  }) => {
    const [account, chainId] = await Promise.all([
      porto.provider
        .request({ method: 'eth_accounts' })
        .then(([account]) => account),
      porto.provider
        .request({ method: 'eth_chainId' })
        .then(Hex.toNumber) as Promise<ChainId>,
    ])

    if (spender !== null && !isAddress(spender))
      throw new Error(`invalid spender address: ${spender}`)

    if (!spender) spender = account

    const tokenAddress = exp1Address[chainId as keyof typeof exp1Address]
    if (!tokenAddress) throw new Error(`no EXP on chain ${chainId}`)

    const symbolFn = AbiFunction.fromAbi(exp1Abi, 'symbol')
    const noncesFn = AbiFunction.fromAbi(exp1Abi, 'nonces')
    const [name, nonce] = await Promise.all([
      porto.provider
        .request({
          method: 'eth_call',
          params: [
            {
              data: AbiFunction.encodeData(symbolFn),
              to: tokenAddress,
            },
          ],
        })
        .then((result) => AbiFunction.decodeResult(symbolFn, result)),
      porto.provider
        .request({
          method: 'eth_call',
          params: [
            {
              data: AbiFunction.encodeData(noncesFn, [account]),
              to: tokenAddress,
            },
          ],
        })
        .then((result) => AbiFunction.decodeResult(noncesFn, result)),
    ])

    const message = {
      domain: {
        chainId,
        name,
        verifyingContract: tokenAddress,
        version: '1',
      },
      message: {
        deadline: BigInt(deadline),
        nonce: BigInt(nonce),
        owner: account,
        spender: spender,
        value,
      },
      primaryType: 'Permit',
      types: {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    } as const

    const signature = await porto.provider.request({
      method: 'eth_signTypedData_v4',
      params: [account, TypedData.serialize(message)],
    })

    return {
      hash: hashTypedData(message),
      signature,
    }
  }

  const signPermit2 = async ({
    deadline,
    spender,
    value,
  }: {
    deadline: bigint
    spender: null | `0x${string}`
    value: bigint
  }) => {
    const [account, chainId] = await Promise.all([
      porto.provider
        .request({ method: 'eth_accounts' })
        .then(([account]) => account),
      porto.provider
        .request({ method: 'eth_chainId' })
        .then(Hex.toNumber) as Promise<ChainId>,
    ])

    if (spender !== null && !isAddress(spender))
      throw new Error(`invalid spender address: ${spender}`)

    if (!spender) spender = account

    const tokenAddress = exp1Address[chainId as keyof typeof exp1Address]
    if (!tokenAddress) throw new Error(`no EXP on chain ${chainId}`)

    const message = getPermit2Data(
      chainId,
      value,
      deadline,
      spender,
      tokenAddress,
    )

    const signature = await porto.provider.request({
      method: 'eth_signTypedData_v4',
      params: [account, TypedData.serialize(message)],
    })

    return {
      hash: hashTypedData(message),
      signature,
    }
  }

  React.useEffect(() => {
    if (verifyStatus !== 'verifying' || !typedMessage) return

    let cancel = false

    const verifySignature = async () => {
      try {
        const [account] = await porto.provider.request({
          method: 'eth_accounts',
        })

        const valid = await verifyHash(client, {
          address: account,
          hash: typedMessage.hash,
          signature: typedMessage.signature,
        })

        if (cancel) return
        setVerifyStatus(valid ? 'valid' : 'invalid')
      } catch (err) {
        if (cancel) return
        console.error(err)
        setVerifyStatus(null)
        setError(String(err))
      }
    }
    verifySignature()

    return () => {
      cancel = true
    }
  }, [typedMessage, verifyStatus])

  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 300)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex flex-col gap-4 pt-6 pb-3">
      <h3 className="m-0 pb-0">eth_signTypedData_v4</h3>
      <div className="flex h-[28px] gap-[8px]">
        <button
          className="box-border h-full px-2"
          onClick={async () => {
            setError(null)
            setTypedMessage(null)
            setVerifyStatus(null)

            try {
              setTypedMessage(
                await signMessage(
                  TypedData.serialize(typedData),
                  hashTypedData(typedData),
                ),
              )
            } catch (err) {
              console.error(err)
              setError(String(err))
            }
          }}
          type="button"
        >
          Sign ERC-712 Typed Message
        </button>
        <button
          className="box-border h-full px-2"
          onClick={async () => {
            setError(null)
            setTypedMessage(null)
            setVerifyStatus(null)

            try {
              setTypedMessage(
                await signMessage('invalid'.repeat(40), '0xinvalid'),
              )
            } catch (err) {
              console.error(err)
              setError(String(err))
            }
          }}
          type="button"
        >
          Sign Invalid Typed Message
        </button>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setTypedMessage(null)
          setVerifyStatus(null)

          const formData = new FormData(e.target as HTMLFormElement)
          const amount = formData.get('amount') as string | null
          const spender = formData.get('spender') as string | null

          try {
            setTypedMessage(
              await signPermit({
                deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 10),
                spender: spender && isAddress(spender) ? spender : null,
                value: Value.fromEther(amount || '100'),
              }),
            )
          } catch (err) {
            console.error(err)
            setError(String(err))
          }
        }}
      >
        <div className="flex h-[28px] gap-[8px]">
          <input
            className="box-border h-full px-2"
            name="spender"
            placeholder="Spender (default: self)"
          />
          <input
            className="box-border flex h-full px-2"
            name="amount"
            placeholder="Amount (default: 100)"
          />
          <button className="box-border h-full px-2" type="submit">
            Sign ERC-2612 Permit
          </button>
        </div>
      </form>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setTypedMessage(null)
          setVerifyStatus(null)

          const formData = new FormData(e.target as HTMLFormElement)
          const amount = formData.get('amount') as string | null
          const spender = formData.get('spender') as string | null

          try {
            setTypedMessage(
              await signPermit2({
                deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 10),
                spender: spender && isAddress(spender) ? spender : null,
                value: Value.fromEther(amount || '100'),
              }),
            )
          } catch (err) {
            console.error(err)
            setError(String(err))
          }
        }}
      >
        <div className="flex h-[28px] gap-[8px]">
          <input
            className="box-border h-full px-2"
            name="spender"
            placeholder="Spender (default: self)"
          />
          <input
            className="box-border flex h-full px-2"
            name="amount"
            placeholder="Amount (default: 100)"
          />
          <button className="box-border h-full px-2" type="submit">
            Sign Permit2
          </button>
        </div>
      </form>

      {error ? (
        <div className="flex flex-col gap-2">
          <h4 className="m-0">Signing error</h4>
          <div className="">{error}</div>
        </div>
      ) : (
        typedMessage && (
          <div className="flex flex-col gap-2">
            <h4 className="m-0">Signature</h4>
            <div className="wrap-anywhere m-0 min-h-40 pb-2 font-mono text-xs">
              {typedMessage.signature}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-sm"
                disabled={copied}
                onClick={() => {
                  navigator.clipboard.writeText(typedMessage.signature ?? '')
                  setCopied(true)
                }}
                type="button"
              >
                {copied ? 'Copied.' : 'Copy'}
              </button>
              <button
                className="px-2 py-1 text-sm"
                disabled={verifyStatus === 'verifying'}
                onClick={() => setVerifyStatus('verifying')}
                type="button"
              >
                {verifyStatus === 'verifying' ? 'Verifying…' : 'Verify'}
              </button>

              {(verifyStatus === 'valid' || verifyStatus === 'invalid') && (
                <div>
                  Message signature{' '}
                  {verifyStatus === 'valid' ? 'valid' : 'invalid'}.
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
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

          keyPair = { privateKey, publicKey }

          const chainId = Hex.toNumber(
            await porto.provider.request({
              method: 'eth_chainId',
            }),
          ) as ChainId

          const p = permissions({ chainId })
          if (!p) {
            console.warn(`no permissions to grant for chainId ${chainId}`)
            return
          }

          const result = await porto.provider.request({
            method: 'wallet_grantPermissions',
            params: [
              {
                key: { publicKey, type: 'p256' },
                ...p,
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

        const chainId = Hex.toNumber(
          await porto.provider.request({
            method: 'eth_chainId',
          }),
        ) as ChainId

        const calls = (() => {
          if (action === 'mint') {
            const token = exp1Address[chainId as never]
            if (!token)
              throw new Error(`exp1 address not defined for chainId ${chainId}`)
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('100')],
                ),
                to: token,
              },
            ]
          }

          if (action === 'transfer') {
            const token = exp1Address[chainId as never]
            if (!token)
              throw new Error(`exp1 address not defined for chainId ${chainId}`)
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'approve'),
                  [account, Value.fromEther('50')],
                ),
                to: token,
              },
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    account,
                    '0x0000000000000000000000000000000000000000',
                    Value.fromEther('50'),
                  ],
                ),
                to: token,
              },
            ] as const
          }

          if (action === 'revert') {
            const token = exp2Address[chainId as never]
            if (!token)
              throw new Error(`exp2 address not defined for chainId ${chainId}`)
            return [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'transferFrom'),
                  [
                    '0x0000000000000000000000000000000000000000',
                    account,
                    Value.fromEther('100'),
                  ],
                ),
                to: token,
              },
            ] as const
          }

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
              chainId: Hex.fromNumber(chainId),
              key: {
                publicKey: keyPair.publicKey,
                type: 'p256',
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
      {hash && <pre>{hash}</pre>}
    </form>
  )
}

function ShowClientCapabilities() {
  const [userClientCapabilities, setUserClientCapabilities] =
    React.useState<PublicKeyCredentialClientCapabilities | null>(null)

  React.useEffect(() => {
    const check = async () => {
      const capabilities = await PublicKeyCredential.getClientCapabilities()
      setUserClientCapabilities(capabilities)
      console.info(capabilities)
    }
    check().catch(console.error)
  }, [])

  return (
    <details className="">
      <summary>User Client Capabilities</summary>
      <pre>{JSON.stringify(userClientCapabilities, null, 2)}</pre>
    </details>
  )
}

function Theme({
  onChange,
  theme,
}: {
  onChange: (theme: ThemeType) => void
  theme: ThemeType
}) {
  const radioName = React.useId()
  return (
    <div>
      <h3>Theme</h3>
      <div className="flex flex-row gap-2">
        {Object.keys(themes).map((key) => (
          <label className="flex gap-1" key={key}>
            <input
              checked={theme === key}
              name={radioName}
              onChange={() => onChange(key as ThemeType)}
              type="radio"
            />
            {key}
          </label>
        ))}
      </div>
    </div>
  )
}

const typedData = {
  domain: {
    chainId: 1,
    name: 'Ether Mail 🥵',
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1.1.1',
  },
  message: {
    contents: 'Hello, Bob! 🖤',
    from: {
      age: 69,
      favoriteColors: ['red', 'green', 'blue'],
      foo: 123123123123123123n,
      isCool: false,
      name: {
        first: 'Cow',
        last: 'Burns',
      },
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: 1234567890n,
    to: {
      age: 70,
      favoriteColors: ['orange', 'yellow', 'green'],
      foo: 123123123123123123n,
      isCool: true,
      name: { first: 'Bob', last: 'Builder' },
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
  },
  primaryType: 'Mail',
  types: {
    Mail: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
      { name: 'hash', type: 'bytes' },
    ],
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
  },
} as const

const getPermit2Data = (
  chainId: ChainId,
  amount: bigint,
  deadline: bigint,
  spender: `0x${string}`,
  token: `0x${string}`,
) => {
  return {
    domain: {
      chainId: BigInt(chainId),
      name: 'Permit2',
      verifyingContract: '0x000000000022d473030f116ddee9f6b43ac78ba3',
    },
    message: {
      details: {
        amount,
        expiration: Number(deadline),
        nonce: 0,
        token,
      },
      sigDeadline: deadline,
      spender,
    },
    primaryType: 'PermitSingle',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      PermitDetails: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint160' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' },
      ],
      PermitSingle: [
        { name: 'details', type: 'PermitDetails' },
        { name: 'spender', type: 'address' },
        { name: 'sigDeadline', type: 'uint256' },
      ],
    },
  } as const
}

const isExpChainId = (chainId: number): chainId is keyof typeof exp1Address =>
  Object.hasOwn(exp1Address, chainId)
