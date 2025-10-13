import { Base64 } from 'ox'
import { Platform } from 'react-native'
import * as passkey from 'react-native-passkeys'
import type OxWebAuthn from '../node_modules/ox/_types/core/internal/webauthn'

const arrayBufferToBase64URL = (buffer: ArrayBuffer) =>
  Base64.fromBytes(new Uint8Array(buffer), { url: true })

const utf8StringToBuffer = (value: string) =>
  new TextEncoder().encode(value) as unknown as ArrayBuffer

const base64URLToArrayBuffer = (input: string) => Base64.toBytes(input)

export const bufferToBase64URL = (input: BufferSource) =>
  btoa(
    String.fromCharCode(
      ...(input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : new Uint8Array(input.buffer, input.byteOffset, input.byteLength)),
    ),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

const rpDomain =
  process.env.EXPO_PUBLIC_SERVER_DOMAIN || 'xporto.up.railway.app'

export const rp = {
  id: Platform.select({
    android: rpDomain,
    ios: rpDomain,
  }),
  name: 'porto-rn',
} satisfies PublicKeyCredentialRpEntity

export const user = {
  displayName: 'username',
  id: bufferToBase64URL(utf8StringToBuffer('290283490')),
  name: 'username',
} satisfies PublicKeyCredentialUserEntityJSON

export const authenticatorSelection = {
  residentKey: 'required',
  userVerification: 'required',
} satisfies AuthenticatorSelectionCriteria

export async function createFn(
  options?: OxWebAuthn.CredentialCreationOptions,
): Promise<Credential | null> {
  const publicKey = (options?.publicKey ||
    options) as PublicKeyCredentialCreationOptions

  const json = {
    attestation: publicKey.attestation,
    authenticatorSelection: publicKey.authenticatorSelection,
    challenge: bufferToBase64URL(publicKey.challenge as ArrayBuffer),
    excludeCredentials: publicKey.excludeCredentials?.map((d) => ({
      ...d,
      id: arrayBufferToBase64URL(d.id as ArrayBuffer),
    })),
    extensions: {
      ...publicKey.extensions,
      largeBlob: { support: 'preferred' as const },
    },
    pubKeyCredParams: publicKey.pubKeyCredParams,
    rp: publicKey.rp ?? (rp?.id ? { id: rp.id, name: rp.id } : undefined),
    signal: options?.signal,
    timeout: publicKey.timeout,
    user: {
      ...publicKey.user,
      id: bufferToBase64URL(publicKey.user.id as ArrayBuffer),
    },
  }

  const response = await passkey.create(json)
  if (!response) throw new Error('Passkey creation cancelled')

  const credential = {
    authenticatorAttachment: response.authenticatorAttachment || null,
    getClientExtensionResults: () => response.clientExtensionResults || {},
    id: response.id,
    rawId: base64URLToArrayBuffer(response.rawId),
    response: {
      attestationObject: base64URLToArrayBuffer(
        response.response.attestationObject,
      ),
      clientDataJSON: base64URLToArrayBuffer(response.response.clientDataJSON),
      getAuthenticatorData: () => new ArrayBuffer(0),
      getPublicKey: () => {
        throw new Error('Permission denied to access object')
      },
      getPublicKeyAlgorithm: () => -7,
      getTransports: () => [],
    },
    type: response.type,
  }

  return credential as unknown as Credential
}

export async function getFn(
  options?: OxWebAuthn.CredentialRequestOptions,
): Promise<Credential | null> {
  const publicKey =
    options?.publicKey || (options as PublicKeyCredentialRequestOptions)

  const response = await passkey.get({
    allowCredentials: publicKey.allowCredentials?.map((item) => ({
      ...item,
      id: bufferToBase64URL(item.id as ArrayBuffer),
    })),
    challenge: bufferToBase64URL(publicKey.challenge as ArrayBuffer),
    extensions: { largeBlob: { support: 'preferred' as const } },
    rpId: publicKey.rpId,
    timeout: publicKey.timeout,
    userVerification: publicKey.userVerification,
  })
  if (!response) throw new Error('Passkey authentication cancelled')

  const credential = {
    authenticatorAttachment: response.authenticatorAttachment || null,
    getClientExtensionResults: () => response.clientExtensionResults || {},
    id: response.id,
    rawId: base64URLToArrayBuffer(response.rawId),
    response: {
      authenticatorData: base64URLToArrayBuffer(
        response.response.authenticatorData,
      ),
      clientDataJSON: base64URLToArrayBuffer(response.response.clientDataJSON),
      signature: base64URLToArrayBuffer(response.response.signature),
      userHandle: response.response.userHandle
        ? base64URLToArrayBuffer(response.response.userHandle)
        : null,
    },
    type: response.type,
  }

  return credential as unknown as Credential
}
