import Checkbox from 'expo-checkbox'
import * as Linking from 'expo-linking'
import { type Address, Hex, Json } from 'ox'
import * as React from 'react'
import {
  Button,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  generatePrivateKey,
  privateKeyToAccount,
  privateKeyToAddress,
} from 'viem/accounts'

import { permissions, porto } from './porto.ts'

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SIWE_URL
if (!SERVER_BASE_URL) throw new Error('EXPO_PUBLIC_SIWE_URL is not set')

// siwe auth routes
const authUrl = {
  logout: `${SERVER_BASE_URL}/api/siwe/logout`,
  nonce: `${SERVER_BASE_URL}/api/siwe/nonce`,
  verify: `${SERVER_BASE_URL}/api/siwe/verify`,
} as const

export default function App() {
  return (
    <ScrollView
      style={{
        flex: 1,
        height: '100%',
        marginTop: Platform.select({ default: 100, web: 0 }),
        padding: 16,
      }}
    >
      <Connect />
      <Divider />
      <Me />
      <Divider />
      <UpgradeAccount />
      <Divider />
      <SignMessage />
      <Divider />
      <GrantPermissions />
      <Divider />
      <GetPermissions />
    </ScrollView>
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
                            authUrl,
                            domain: SERVER_BASE_URL,
                            uri: link,
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
          onPress={async () => {
            const link = Linking.createURL('/')

            const payload = {
              capabilities: {
                createAccount: true,
                grantPermissions: grantPermissions ? permissions() : undefined,
                signInWithEthereum: signInWithEthereum
                  ? {
                      authUrl,
                      domain: SERVER_BASE_URL,
                      uri: link,
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
          title="Register"
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

function Me() {
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View>
      <Text>Fetch `/me` (authenticated endpoint)</Text>
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
  const [result, setResult] = React.useState<unknown | null>(null)

  const [error, setError] = React.useState<string | null>(null)

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
      <View>
        <Button
          onPress={async () => {
            try {
              if (!privateKey) throw new Error('Private key is required')
              const account = privateKeyToAccount(privateKey)

              const { context, digests } = await porto.provider.request({
                method: 'wallet_prepareUpgradeAccount',
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
              console.info(error)
              setError(
                Json.stringify(
                  { error: error instanceof Error ? error.message : error },
                  null,
                  2,
                ),
              )
            }
          }}
          title="Upgrade EOA to Porto Account"
        />
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

  return (
    <View>
      <Text>wallet_getPermissions</Text>
      <Button
        onPress={() =>
          porto.provider
            .request({ method: 'wallet_getPermissions' })
            .then(setResult)
        }
        title="Get Permissions"
      />
      {result ? <Pre text={result} /> : null}
    </View>
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
