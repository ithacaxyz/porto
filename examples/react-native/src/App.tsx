import Checkbox from 'expo-checkbox'
import {
  AbiFunction,
  type Hex,
  Json,
  P256,
  PublicKey,
  Signature,
  Value,
} from 'ox'
import { RelayActions, RelayClient } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import {
  Button,
  Linking,
  ScrollView,
  StatusBar,
  type StyleProp,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  useAccount,
  useCapabilities,
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
  useSendCalls,
  useSignMessage,
  useWaitForCallsStatus,
} from 'wagmi'

import { config, permissions } from './config.ts'
import { exp1Abi, exp1Address } from './contracts.ts'
import { Providers } from './Providers.tsx'

export default function App() {
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
                fontSize: 26,
                fontWeight: '600',
                textAlign: 'center',
                textDecorationLine: 'none',
              }}
              text="Porto React Native Example"
            />

            <Connect />
            <SignMessage />
            <SendCalls />
            <Divider />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Permissions
            </Text>
            <GrantPermissions />
            <GetPermissions />
            <Divider />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              App-managed Signing
            </Text>
            <GrantKeyPermissions />
            <PreparedCalls />
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
  const [email, setEmail] = React.useState<boolean>(true)
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(false)

  const account = useAccount()
  const connect = useConnect()

  const disconnect = useDisconnect()
  const [connector] = useConnectors()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_connect</Text>
      <View>
        {account.isDisconnected && (
          <Button
            onPress={async () =>
              connect.connect({
                capabilities: {
                  createAccount: false,
                  email,
                  grantPermissions: grantPermissions
                    ? permissions()
                    : undefined,
                },
                connector,
              })
            }
            title="Login"
          />
        )}
        <Divider />
        <Button
          onPress={async () => {
            disconnect.disconnectAsync().then(() =>
              connect.connect({
                capabilities: {
                  createAccount: true,
                  email,
                  grantPermissions: grantPermissions
                    ? permissions()
                    : undefined,
                },
                connector,
              }),
            )
          }}
          title="Register"
        />
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
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
      </View>
      {connect.isPending && <Text>Connecting...</Text>}
      {account.address && (
        <Pre
          text={Json.stringify(
            {
              addresses: account.addresses,
              chainId: account.chainId,
              status: account.status,
            },
            null,
            2,
          )}
        />
      )}
      {connect.isError && <Pre text={connect.error} />}
      {connect.isSuccess ||
        (account.isConnected && (
          <Button onPress={() => disconnect.disconnect()} title="Disconnect" />
        ))}
    </View>
  )
}

function SignMessage() {
  const signMessage = useSignMessage()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>personal_sign</Text>
      <Button
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
  const grantPermissions = Hooks.useGrantPermissions()
  return (
    <View style={{ marginBottom: 16 }}>
      <Text>wallet_grantPermissions</Text>
      <Button
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
      <Text>wallet_sendCalls (Mint 100 EXP)</Text>
      <Button
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
        title="Send Calls"
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

let keyPair: {
  publicKey: Hex.Hex
  privateKey: Hex.Hex
} | null = null

function GrantKeyPermissions() {
  const chainId = useChainId()
  const grantPermissions = Hooks.useGrantPermissions()

  return (
    <View style={{ marginBottom: 16 }}>
      <Text> Create Key & Grant Permissions</Text>
      <Button
        onPress={async () => {
          const privateKey = P256.randomPrivateKey()
          const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
            includePrefix: false,
          })
          keyPair = { privateKey, publicKey }

          await grantPermissions.mutateAsync({
            ...permissions(),
            chainId,
            key: { publicKey, type: 'p256' },
          })
        }}
        title="Create & Grant Permissions"
      />
      {grantPermissions.isPending && <Text>Granting Permissions...</Text>}
      {grantPermissions.isSuccess && <Pre text={grantPermissions.data} />}
      {grantPermissions.isError && <Pre text={grantPermissions.error} />}
    </View>
  )
}

function PreparedCalls() {
  const chainId = useChainId()
  const account = useAccount()

  const permissions = Hooks.usePermissions()
  const keyPermissions = permissions.data?.find((x) => x.key.type === 'p256')

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
    permissions.refetch()
    setIsPending(true)
    setIsSuccess(false)
    setError(null)
    setCallBundleId(undefined)
    try {
      if (!keyPair) throw new Error('Key pair not created')
      if (!keyPermissions)
        throw new Error('Permissions not yet granted for session key')
      if (!account.chain) throw new Error('Account chain not found')

      const porto = await config.connectors.at(0)?.getPortoInstance()
      if (!porto) throw new Error('Porto instance not found')

      const client = RelayClient.fromPorto(porto, {
        account: account.address,
        chainId,
      })

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
        key: {
          permissions: keyPermissions.permissions,
          prehash: false,
          publicKey: keyPair.publicKey,
          type: 'p256',
        },
      })

      const signature = Signature.toHex(
        P256.sign({
          payload: digest,
          privateKey: keyPair.privateKey,
        }),
      )

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
      console.info(
        'current permissions ids',
        permissions.data?.map((x) => x.id),
      )
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
        disabled={isPending || !keyPermissions}
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
