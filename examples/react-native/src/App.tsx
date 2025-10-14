import Checkbox from 'expo-checkbox'
import { Hex, Json } from 'ox'
import * as React from 'react'
import { Button, ScrollView, Text, View } from 'react-native'

import { permissions, porto } from './config'

export default function App() {
  return (
    <ScrollView
      style={{ flex: 1, height: '100%', marginTop: 100, padding: 16 }}
    >
      <Connect />
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
  const [email, setEmail] = React.useState<boolean>(true)
  const [grantPermissions, setGrantPermissions] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<unknown | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Text>wallet_connect</Text>
      <View>
        <Button
          onPress={async () => {
            const payload = {
              capabilities: {
                createAccount: false,
                email,
                grantPermissions: grantPermissions ? permissions() : undefined,
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
          title="Login"
        />
        <Divider />
        <Button
          onPress={async () => {
            const payload = {
              capabilities: {
                createAccount: true,
                email,
                grantPermissions: grantPermissions ? permissions() : undefined,
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
      <Pre text={result} />
      <Pre text={error} />
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
          const accounts = await porto.provider.request({
            method: 'eth_accounts',
          })
          if (!accounts[0]) return
          const result = await porto.provider.request({
            method: 'personal_sign',
            params: [Hex.fromString('hello world'), accounts[0]],
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
