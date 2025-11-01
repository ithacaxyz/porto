import Checkbox from 'expo-checkbox'
import * as Linking from 'expo-linking'
import {
  AbiFunction,
  type Address,
  Hex,
  Json,
  P256,
  PublicKey,
  Signature,
  Value,
} from 'ox'
import * as React from 'react'
import {
  Button,
  Platform,
  ScrollView,
  StatusBar,
  type StyleProp,
  Text,
  TextInput,
  type TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'

import { exp1Abi, exp1Address } from './contracts.ts'
import { supportsAccountUpgrade } from './passkeys.ts'
import { permissions, porto } from './porto.ts'

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SIWE_URL
if (!SERVER_BASE_URL) throw new Error('EXPO_PUBLIC_SIWE_URL is not set')

const authUrl = {
  logout: `${SERVER_BASE_URL}/api/siwe/logout`,
  nonce: `${SERVER_BASE_URL}/api/siwe/nonce`,
  verify: `${SERVER_BASE_URL}/api/siwe/verify`,
} as const

type SessionKeyPair = {
  privateKey: Hex.Hex
  publicKey: Hex.Hex
} | null

export default function App() {
  const [sessionKey, setSessionKey] = React.useState<SessionKeyPair>(null)
  const passkeysAvailable = supportsAccountUpgrade

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
      >
        <ScrollView style={{ backgroundColor: '#F7F7F7', padding: 16 }}>
          <Link
            href="https://porto.sh/sdk/api/mode#modereactnative"
            style={{
              fontSize: 22,
              fontWeight: '600',
              textAlign: 'center',
              textDecorationLine: 'none',
            }}
            text="Porto React Native (Relay Mode)"
          />
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Connect</Text>
          <Connect />
          <Divider />
          {passkeysAvailable ? (
            <>
              <Me />
              <Divider />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                EOA to Porto Account
              </Text>
              <UpgradeAccount />
              <Divider />
              <SignMessage />
              <Divider />
              <SendCalls />
              <Divider />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                Permissions
              </Text>
              <GrantPermissions />
              <GetPermissions />
              <Divider />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                App-managed Signing ("session keys")
              </Text>
              <GrantKeyPermissions onKeyCreated={setSessionKey} />
              <PreparedCalls sessionKey={sessionKey} />
              <Divider />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Misc.</Text>
              <Capabilities />
            </>
          ) : (
            <PasskeyUnavailable />
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

function Connect() {
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(false)
  const [signInWithEthereum, setSignInWithEthereum] = React.useState<boolean>(
    !!process.env.EXPO_PUBLIC_SIWE_URL,
  )
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Text>wallet_connect</Text>
      <View>
        <Button
          onPress={async () => {
            const link = Linking.createURL('/')

            porto.provider
              .request({
                method: 'wallet_connect',
                params: [
                  {
                    capabilities: {
                      createAccount: false,
                      grantPermissions: grantPermissions
                        ? permissions()
                        : undefined,
                      signInWithEthereum: signInWithEthereum
                        ? {
                            ...Platform.select({
                              default: {
                                authUrl,
                                domain: SERVER_BASE_URL,
                                uri: link,
                              },
                              web: { authUrl },
                            }),
                          }
                        : undefined,
                    },
                  },
                ],
              })
              .then(setResult)
              .catch((error) => {
                console.error(error)
                setError(Json.stringify({ error: error.message }, null, 2))
              })
          }}
          title="Login"
        />
        <Divider />
        <Button
          disabled={!supportsAccountUpgrade}
          onPress={async () => {
            if (!supportsAccountUpgrade) return
            const link = Linking.createURL('/')

            const payload = {
              capabilities: {
                createAccount: supportsAccountUpgrade,
                grantPermissions: grantPermissions ? permissions() : undefined,
                signInWithEthereum: signInWithEthereum
                  ? {
                      ...Platform.select({
                        default: {
                          authUrl,
                          domain: SERVER_BASE_URL,
                          uri: link,
                        },
                        web: { authUrl },
                      }),
                    }
                  : undefined,
              },
            } as const
            return porto.provider
              .request({
                method: 'wallet_connect',
                params: [payload],
              })
              .then(setResult)
              .catch((error) => {
                console.error(error)
                setError(
                  Json.stringify({ error: error.message, payload }, null, 2),
                )
              })
          }}
          title={
            supportsAccountUpgrade ? 'Register' : 'Register (passkeys required)'
          }
        />
        <Divider />
        <Button
          onPress={async () =>
            porto.provider
              .request({
                method: 'wallet_disconnect',
              })
              .then(setResult)
              .catch((error) => {
                console.error(error)
                setError(Json.stringify({ error: error.message }, null, 2))
              })
          }
          title="Disconnect"
        />
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Checkbox
            onValueChange={() => setGrantPermissions((x) => !x)}
            value={grantPermissions}
          />
          <Text>Grant Permissions</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Checkbox
            onValueChange={() => setSignInWithEthereum((x) => !x)}
            value={signInWithEthereum}
          />
          <Text>Sign-In with Ethereum</Text>
        </View>
      </View>
      <Pre text={error} />
      <Pre text={result} />
    </View>
  )
}

function PasskeyUnavailable() {
  return (
    <View style={{ gap: 16 }}>
      <Text style={{ fontWeight: '600' }}>
        Passkeys unavailable on this device
      </Text>
      <Text>
        Account upgrade and signing flows require the native
        `react-native-passkeys` module. Install and rebuild the application on a
        compatible device (iOS 15+/Android with Credential Manager) to test
        these examples.
      </Text>
    </View>
  )
}

function Me() {
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View>
      <Text>Fetch /me (authenticated endpoint)</Text>
      <Button
        onPress={() =>
          void fetch(`${SERVER_BASE_URL}/api/me`, { credentials: 'include' })
            .then((result) => result.text())
            .then((result) => setResult(result))
            .catch((error) => {
              console.error(error)
              setError(Json.stringify({ error: error.message }, null, 2))
            })
        }
        title="Me"
      />

      <Pre text={result} />
      {error && <Pre text={error} />}
    </View>
  )
}

function UpgradeAccount() {
  const [accountData, setAccountData] = React.useState<{
    address: Address.Address
    privateKey: Hex.Hex
  } | null>(null)

  const [grantPermissions, setGrantPermissions] = React.useState(true)
  const [privateKey, setPrivateKey] = React.useState<Hex.Hex | null>(null)
  const [signInWithEthereum, setSignInWithEthereum] =
    React.useState<boolean>(false)

  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<unknown | null>(null)

  async function upgradeAccount() {
    try {
      if (!privateKey) throw new Error('Private key is required')
      const account = privateKeyToAccount(privateKey)
      const link = Linking.createURL('/')

      const { context, digests } = await porto.provider.request({
        method: 'wallet_prepareUpgradeAccount',
        params: [
          {
            address: account.address,
            capabilities: {
              grantPermissions: grantPermissions ? permissions() : undefined,
              signInWithEthereum: signInWithEthereum
                ? {
                    ...Platform.select({
                      default: {
                        authUrl,
                        domain: SERVER_BASE_URL,
                        uri: link,
                      },
                      web: { authUrl },
                    }),
                  }
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
    } catch (error) {
      console.error(error)
      setError(
        Json.stringify(
          { error: error instanceof Error ? error.message : error },
          null,
          2,
        ),
      )
    }
  }

  return (
    <View>
      <Text>wallet_upgradeAccount</Text>
      <View>
        <Button
          onPress={() => {
            const privateKey = generatePrivateKey()
            setPrivateKey(privateKey)
            setAccountData({
              address: privateKeyToAddress(privateKey),
              privateKey,
            })
          }}
          title="Create EOA"
        />

        {accountData && <Pre text={accountData} />}
      </View>
      <View>
        <TextInput
          onChangeText={(text) => setPrivateKey(text as Hex.Hex)}
          placeholder="Private Key (leave empty to generate new EOA)"
          style={{
            backgroundColor: '#fff',
            borderColor: '#ccc',
            borderWidth: 1,
            flex: 1,
            height: 30,
            marginVertical: 6,
            padding: 6,
          }}
          value={privateKey ?? ''}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <Checkbox
          onValueChange={() => setGrantPermissions((x) => !x)}
          value={grantPermissions}
        />
        <Text>Grant Permissions</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <Checkbox
          onValueChange={() => setSignInWithEthereum((x) => !x)}
          value={signInWithEthereum}
        />
        <Text>Sign-In with Ethereum</Text>
      </View>
      <View>
        <Button onPress={upgradeAccount} title="Upgrade EOA to Porto Account" />
      </View>
      {result ? <Pre text={result} /> : error && <Pre text={error} />}
    </View>
  )
}

function SignMessage() {
  const [signature, setSignature] = React.useState<string | null>(null)

  return (
    <View>
      <Text>personal_sign</Text>
      <Button
        onPress={async () => {
          const [account] = await porto.provider.request({
            method: 'eth_accounts',
          })
          if (!account) return
          const result = await porto.provider.request({
            method: 'personal_sign',
            params: [Hex.fromString('hello world'), account],
          })
          setSignature(result)
        }}
        title="Sign Message"
      />
      <Pre text={signature} />
    </View>
  )
}

function GrantPermissions() {
  const [result, setResult] = React.useState<unknown | null>(null)
  return (
    <View>
      <Text>wallet_grantPermissions</Text>
      <Button
        onPress={async () => {
          const p = permissions()
          if (!p) {
            console.warn('no permissions to grant')
            return
          }
          const result = await porto.provider.request({
            method: 'wallet_grantPermissions',
            params: [p],
          })
          setResult(result)
        }}
        title="Grant Permissions"
      />
      <Pre text={result} />
    </View>
  )
}

function GetPermissions() {
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View>
      <Text>wallet_getPermissions</Text>
      <Button
        onPress={() =>
          porto.provider
            .request({ method: 'wallet_getPermissions' })
            .then(setResult)
            .catch((error) => {
              console.error(error)
              setError(Json.stringify({ error: error.message }, null, 2))
            })
        }
        title="Get Permissions"
      />
      {result ? <Pre text={result} /> : error && <Pre text={error} />}
    </View>
  )
}

function SendCalls() {
  const [id, setId] = React.useState<Hex.Hex | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [txHash, setTxHash] = React.useState<string | null>(null)

  async function sendCalls() {
    try {
      const [account] = await porto.provider.request({ method: 'eth_accounts' })
      if (!account) throw new Error('Account not found')

      const chainId = await porto.provider.request({ method: 'eth_chainId' })

      const { id } = await porto.provider.request({
        method: 'wallet_sendCalls',
        params: [
          {
            calls: [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account, Value.fromEther('10')],
                ),
                to: exp1Address,
              },
            ],
            chainId,
            from: account,
          },
        ],
      })
      setId(id)
    } catch (error) {
      console.error(error)
      setError(
        Json.stringify(
          { error: error instanceof Error ? error.message : error },
          null,
          2,
        ),
      )
    }
  }

  React.useEffect(() => {
    async function getCallsStatus() {
      if (!id) return
      const { receipts } = await porto.provider.request({
        method: 'wallet_getCallsStatus',
        params: [id],
      })

      const txHash = receipts?.at(0)?.transactionHash

      const blockExplorerUrl =
        porto.config.chains.at(0)?.blockExplorers.default.url
      if (!blockExplorerUrl) throw new Error('blockExplorerUrl is not set')
      if (txHash) setTxHash(`${blockExplorerUrl}/tx/${txHash}`)
    }
    void getCallsStatus()
  }, [id])

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_sendCalls</Text>
      <Button onPress={sendCalls} title="Send Calls" />
      {id ? <Pre text={{ bundleId: id }} /> : error && <Pre text={error} />}
      {txHash ? (
        <Link href={txHash} text={txHash} />
      ) : (
        error && <Pre text={error} />
      )}
    </View>
  )
}

function GrantKeyPermissions({
  onKeyCreated,
}: {
  onKeyCreated: (key: SessionKeyPair) => void
}) {
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View>
      <Text>Create Key & Grant Permissions</Text>
      <Button
        onPress={async () => {
          try {
            const privateKey = P256.randomPrivateKey()
            const publicKey = PublicKey.toHex(
              P256.getPublicKey({ privateKey }),
              {
                includePrefix: false,
              },
            )

            onKeyCreated(null)

            const results = await porto.provider.request({
              method: 'wallet_grantPermissions',
              params: [
                {
                  key: { publicKey, type: 'p256' },
                  ...permissions(),
                },
              ],
            })
            onKeyCreated({ privateKey, publicKey })
            setResult(results)
          } catch (error) {
            setError(
              Json.stringify(
                { error: error instanceof Error ? error.message : error },
                null,
                2,
              ),
            )
            onKeyCreated(null)
          }
        }}
        title="Create Key & Grant Permissions"
      />
      {result ? <Pre text={result} /> : error && <Pre text={error} />}
    </View>
  )
}

function PreparedCalls({ sessionKey }: { sessionKey: SessionKeyPair }) {
  const [hash, setHash] = React.useState<Hex.Hex | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_prepareCalls → P256.sign → wallet_sendPreparedCalls</Text>
      <Button
        onPress={async () => {
          try {
            if (!sessionKey) throw new Error('Session key not created')

            const [account] = await porto.provider.request({
              method: 'eth_accounts',
            })
            if (!account) throw new Error('Account not found')

            const chainId = await porto.provider.request({
              method: 'eth_chainId',
            })

            const { digest, ...request } = await porto.provider.request({
              method: 'wallet_prepareCalls',
              params: [
                {
                  calls: [
                    {
                      data: AbiFunction.encodeData(
                        AbiFunction.fromAbi(exp1Abi, 'mint'),
                        [account, Value.fromEther('10')],
                      ),
                      to: exp1Address,
                    },
                  ],
                  chainId,
                  key: {
                    publicKey: sessionKey.publicKey,
                    type: 'p256',
                  },
                },
              ],
            })

            const signature = Signature.toHex(
              P256.sign({
                payload: digest,
                privateKey: sessionKey.privateKey,
              }),
            )

            const [{ id: hash }] = await porto.provider.request({
              method: 'wallet_sendPreparedCalls',
              params: [{ ...request, signature }],
            })
            setHash(hash)
          } catch (error) {
            console.error(error)
            setError(
              Json.stringify(
                { error: error instanceof Error ? error.message : error },
                null,
                2,
              ),
            )
          }
        }}
        title="Mint 10 EXP"
      />
      {hash ? <Pre text={hash} /> : error && <Pre text={error} />}
    </View>
  )
}

function Capabilities() {
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_getCapabilities</Text>
      <Button
        onPress={() =>
          porto.provider
            .request({ method: 'wallet_getCapabilities' })
            .then(setResult)
            .catch((error) => {
              console.error(error)
              setError(Json.stringify({ error: error.message }, null, 2))
            })
        }
        title="Get Capabilities"
      />
      {result ? <Pre text={result} /> : error && <Pre text={error} />}
    </View>
  )
}

function Link(props: {
  text?: string
  href: string
  style?: StyleProp<TextStyle>
}) {
  if (!props.href) return null

  return (
    <TouchableOpacity onPress={() => Linking.openURL(props.href)}>
      <Text
        style={[
          { color: '#007AFF', textDecorationLine: 'underline' },
          props.style,
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

function Divider() {
  return (
    <View style={{ backgroundColor: '#ccc', height: 1, marginVertical: 12 }} />
  )
}

function Pre(props: { text?: unknown }) {
  if (!props?.text) return null
  return (
    <View style={{ backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16 }}>
      <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 14 }}>
        {typeof props.text === 'string'
          ? props.text
          : Json.stringify(props.text, null, 2)}
      </Text>
    </View>
  )
}
