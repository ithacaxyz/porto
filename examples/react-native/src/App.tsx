import Checkbox from 'expo-checkbox'
import * as Linking from 'expo-linking'
import { AbiFunction, type Address, type Hex, Json, Value } from 'ox'
import { Key, RelayActions, RelayClient } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import {
  Button,
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
import {
  useAccount,
  useCapabilities,
  useChainId,
  useConnectors,
  useSendCalls,
  useSignMessage,
  useWaitForCallsStatus,
} from 'wagmi'

import { config, permissions } from './config.ts'
import { exp1Abi, exp1Address } from './contracts.ts'
import { Providers } from './Providers.tsx'

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SIWE_URL
if (!SERVER_BASE_URL) throw new Error('EXPO_PUBLIC_SIWE_URL is not set')

const authUrl = {
  logout: `${SERVER_BASE_URL}/api/siwe/logout`,
  nonce: `${SERVER_BASE_URL}/api/siwe/nonce`,
  verify: `${SERVER_BASE_URL}/api/siwe/verify`,
} as const

export default function App() {
  const [sessionKey, setSessionKey] = React.useState<Key.Key | null>(null)

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
      >
        <ScrollView style={{ backgroundColor: '#F7F7F7', padding: 16 }}>
          <Providers>
            <Link
              href="https://porto.sh/sdk/api/mode#modereactnative"
              style={{
                fontSize: 22,
                fontWeight: '600',
                textAlign: 'center',
                textDecorationLine: 'none',
              }}
              text="Porto React Native (Dialog Mode)"
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Connect</Text>
            <Connect />
            <Divider />
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
          </Providers>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

function Connect() {
  const [email, setEmail] = React.useState(true)
  const [grantPermissions, setGrantPermissions] = React.useState(false)
  const [signInWithEthereum, setSignInWithEthereum] = React.useState(
    !!process.env.EXPO_PUBLIC_SIWE_URL,
  )

  const account = useAccount()
  const connect = Hooks.useConnect()
  const [connector] = useConnectors()
  const disconnect = Hooks.useDisconnect()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_connect</Text>
      <View>
        <Button
          onPress={async () =>
            connect.mutate({
              connector,
              createAccount: false,
              email,
              grantPermissions: grantPermissions ? permissions() : undefined,
              signInWithEthereum: signInWithEthereum ? { authUrl } : undefined,
            })
          }
          title="Login"
        />
        <Divider />
        <Button
          onPress={() =>
            connect.mutate({
              connector,
              createAccount: true,
              email,
              grantPermissions: grantPermissions ? permissions() : undefined,
              signInWithEthereum: signInWithEthereum
                ? {
                    authUrl,
                  }
                : undefined,
            })
          }
          title="Register"
        />
        <Divider />
        <Button
          onPress={() => disconnect.mutate({ connector })}
          title="Disconnect"
        />
      </View>

      <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
          <Checkbox onValueChange={() => setEmail((x) => !x)} value={email} />
          <Text>Email</Text>
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
      </View>

      {connect.isPending && <Text>Connecting...</Text>}
      {connect.isSuccess && account.isConnected && (
        <Pre
          text={{
            account: account.address,
            admins: connect.data?.accounts[0]?.capabilities?.admins,
            permissions: connect.data?.accounts[0]?.capabilities?.permissions,
            signInWithEthereum:
              connect.data?.accounts[0]?.capabilities?.signInWithEthereum
                ?.message,
          }}
        />
      )}
      {connect.isError && <Pre text={connect.error} />}
    </View>
  )
}

function Me() {
  const [authToken, setAuthToken] = React.useState<string | null>(null)

  return (
    <View>
      <Text>Fetch /me (authenticated endpoint)</Text>
      <Button
        onPress={async () => {
          try {
            const response = await fetch(`${SERVER_BASE_URL}/api/me`, {
              credentials: 'include',
            })
            const data = await response.text()
            setAuthToken(data)
          } catch (error) {
            console.error(error)
            setAuthToken(null)
          }
        }}
        title="Fetch /me"
      />
      {authToken && <Pre text={authToken} />}
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

  const account = useAccount()
  const [connector] = useConnectors()
  const disconnect = Hooks.useDisconnect()

  const upgradeAccount = Hooks.useUpgradeAccount({
    mutation: {
      onError: (error) => console.error(error),
    },
  })

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
            borderColor: '#ccc',
            borderWidth: 1,
            flex: 1,
            height: 30,
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
            if (account.isConnected) disconnect.mutate({ connector })
            upgradeAccount.mutate({
              account: privateKeyToAccount(privateKey as Hex.Hex),
              connector,
              grantPermissions: grantPermissions ? permissions() : undefined,
            })
          }}
          title="Upgrade EOA to Porto Account"
        />
      </View>
      {upgradeAccount.isPending && <Text>Upgrading Account...</Text>}
      <Pre text={upgradeAccount.status} />
      {upgradeAccount.isSuccess && <Pre text={upgradeAccount.data} />}
      {upgradeAccount.isError && <Pre text={upgradeAccount.error} />}
    </View>
  )
}

function SignMessage() {
  const account = useAccount()
  const signMessage = useSignMessage()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>personal_sign</Text>
      <Button
        disabled={!account.address}
        onPress={async () =>
          signMessage.signMessage({ message: 'hello world' })
        }
        title="Sign Message"
      />
      {signMessage.isPending && <Text>Signing...</Text>}
      {signMessage.isSuccess && <Pre text={signMessage.data} />}
      {signMessage.isError && <Pre text={signMessage.error} />}
    </View>
  )
}

function GrantPermissions() {
  const account = useAccount()
  const grantPermissions = Hooks.useGrantPermissions()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_grantPermissions</Text>
      <Button
        disabled={!account.address}
        onPress={async () => grantPermissions.mutate(permissions())}
        title="Grant Permissions"
      />
      {grantPermissions.isPending && <Text>Granting Permissions...</Text>}
      {grantPermissions.isSuccess && <Pre text={grantPermissions.data} />}
      {grantPermissions.isError && <Pre text={grantPermissions.error} />}
    </View>
  )
}

function GetPermissions() {
  const [fetchPermissions, setFetchPermissions] = React.useState(false)

  const permissions = Hooks.usePermissions({
    query: {
      enabled: fetchPermissions,
    },
  })

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_getPermissions</Text>
      <Button
        onPress={() => setFetchPermissions(true)}
        title="Get Permissions"
      />
      {permissions.isFetching && <Text>Fetching Permissions...</Text>}
      {permissions.isSuccess ? <Pre text={permissions.data} /> : null}
      {permissions.isError && <Pre text={permissions.error} />}
    </View>
  )
}

function SendCalls() {
  const account = useAccount()
  const sendCalls = useSendCalls()
  const callStatus = useWaitForCallsStatus({
    id: sendCalls.data?.id,
    query: {
      enabled: !!sendCalls.data?.id,
    },
  })

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_sendCalls</Text>
      <Button
        disabled={!account.address}
        onPress={() =>
          sendCalls.sendCalls({
            calls: [
              {
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Abi, 'mint'),
                  [account.address!, Value.fromEther('100')],
                ),
                to: exp1Address,
              },
            ],
          })
        }
        title="Mint 100 EXP"
      />
      {sendCalls.isPending && <Text>Sending Calls...</Text>}
      {sendCalls.isError && <Pre text={sendCalls.error.message} />}
      {callStatus.isFetching && <Text>Getting Call Status...</Text>}
      {callStatus.isSuccess && (
        <View>
          <Text>Transaction Hash:</Text>
          <Link
            href={`${account.chain?.blockExplorers.default.url}/tx/${callStatus.data.receipts?.at(0)?.transactionHash}`}
            text={callStatus.data.receipts?.at(0)?.transactionHash}
          />
        </View>
      )}
      {callStatus.isError && <Pre text={callStatus.error.message} />}
    </View>
  )
}

function GrantKeyPermissions({
  onKeyCreated,
}: {
  onKeyCreated: (key: Key.Key | null) => void
}) {
  const account = useAccount()
  const chainId = useChainId()
  const grantPermissions = Hooks.useGrantPermissions()

  const connect = Hooks.useConnect()
  const [connector] = useConnectors()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text> Create Key & Grant Permissions</Text>
      <Button
        disabled={!account.address}
        onPress={async () => {
          if (account.isDisconnected) connect.mutate({ connector })
          const key = Key.createHeadlessWebAuthnP256({
            ...permissions(),
            role: 'session',
          })

          onKeyCreated(null)

          try {
            await grantPermissions.mutateAsync({
              chainId,
              connector,
              ...permissions(),
              key,
            })
            onKeyCreated(key)
          } catch (error) {
            onKeyCreated(null)
          }
        }}
        title="Create & Grant Permissions"
      />
      {grantPermissions.isPending && <Text>Granting Permissions...</Text>}
      {grantPermissions.isSuccess && <Pre text={grantPermissions.data} />}
      {grantPermissions.isError && <Pre text={grantPermissions.error} />}
    </View>
  )
}

function PreparedCalls({ sessionKey }: { sessionKey: Key.Key | null }) {
  const account = useAccount()

  const [isPending, setIsPending] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [callBundleId, setCallBundleId] = React.useState<Hex.Hex | undefined>(
    undefined,
  )

  const callStatus = useWaitForCallsStatus({
    id: callBundleId,
    query: {
      enabled: !!callBundleId,
    },
  })

  async function sendPreparedCalls() {
    setIsPending(true)
    setIsSuccess(false)
    setError(null)
    setCallBundleId(undefined)
    try {
      if (!sessionKey) throw new Error('Session key not created')
      if (!account.chain) throw new Error('Account chain not found')

      const porto = await config.connectors.at(0)?.getPortoInstance()
      if (!porto) throw new Error('Porto instance not found')

      const client = RelayClient.fromPorto(porto)

      const { digest, ...request } = await RelayActions.prepareCalls(client, {
        account: account.address!,
        calls: [
          {
            data: AbiFunction.encodeData(AbiFunction.fromAbi(exp1Abi, 'mint'), [
              account.address!,
              Value.fromEther('10'),
            ]),
            to: exp1Address,
          },
        ],
        chain: account.chain,
        key: sessionKey,
      })

      const signature = await Key.sign(sessionKey, {
        address: null,
        payload: digest,
        wrap: false,
      })

      const { id: callBundleId } = await RelayActions.sendPreparedCalls(
        client,
        {
          ...request,
          signature,
        },
      )
      setCallBundleId(callBundleId)
      setIsPending(false)
      setIsSuccess(true)
      setError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error(errorMessage)
      setIsPending(false)
      setIsSuccess(false)
      setCallBundleId(undefined)
      setError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_prepareCalls → P256.sign → wallet_sendPreparedCalls</Text>
      <Button
        disabled={isPending || !sessionKey}
        onPress={sendPreparedCalls}
        title="Mint 10 EXP"
      />
      {isPending && <Text>Sending Prepared Calls...</Text>}
      {isSuccess && <Text>Prepared Calls Sent Successfully</Text>}
      {callStatus.isSuccess && (
        <View>
          <Text>Transaction Hash:</Text>
          <Link
            href={`${account.chain?.blockExplorers.default.url}/tx/${callStatus.data.receipts?.at(0)?.transactionHash}`}
            text={callStatus.data.receipts?.at(0)?.transactionHash}
          />
        </View>
      )}
      {error && <Pre text={error.message} />}
    </View>
  )
}

function Capabilities() {
  const account = useAccount()
  const [fetchCapabilities, setFetchCapabilities] = React.useState(false)
  const capabilities = useCapabilities({
    query: {
      enabled: fetchCapabilities,
    },
  })
  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_getCapabilities</Text>
      <Button
        disabled={!account.address}
        onPress={() => setFetchCapabilities(true)}
        title="Get Capabilities"
      />
      {capabilities.isFetching && <Text>Fetching Capabilities...</Text>}
      {capabilities.isSuccess && <Pre text={capabilities.data} />}
      {capabilities.isError && <Pre text={capabilities.error} />}
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
