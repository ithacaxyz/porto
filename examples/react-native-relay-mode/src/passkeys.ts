import { Base64 } from 'ox'
import type { Mode } from 'porto'
import { Platform } from 'react-native'

import type OxWebAuthn from '../node_modules/ox/_types/core/internal/webauthn'

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL
if (!SERVER_URL) console.warn('EXPO_PUBLIC_SERVER_URL is not set')

const RELYING_PARTY_DOMAIN = SERVER_URL.replace('https://', '')

const name = 'porto-relay-mode'

export const rp = {
  id: Platform.select({
    default: RELYING_PARTY_DOMAIN,
    web: 'self',
  }),
  name,
} satisfies PublicKeyCredentialRpEntity

export const user = {
  displayName: name.replaceAll('-', ' ').toLocaleUpperCase(),
  id: bufferToBase64URL(new Uint8Array(16)),
  name,
} satisfies PublicKeyCredentialUserEntityJSON

export const authenticatorSelection = {
  residentKey: 'preferred',
  userVerification: 'preferred',
} satisfies AuthenticatorSelectionCriteria

type PasskeysModule = typeof import('react-native-passkeys')

const passkeysModule = (() => {
  try {
    const module = require('react-native-passkeys') as PasskeysModule
    if (typeof module.isSupported === 'function' && !module.isSupported())
      return null
    return module
  } catch {
    return null
  }
})()

export const supportsAccountUpgrade = Boolean(passkeysModule)

export const webAuthn:
  | NonNullable<Parameters<typeof Mode.relay>[number]>['webAuthn']
  | undefined = supportsAccountUpgrade
  ? {
      createFn,
      getFn,
    }
  : undefined

export async function createFn(
  options?: OxWebAuthn.CredentialCreationOptions,
): Promise<OxWebAuthn.Credential | null> {
  const passkeys = assertPasskeys()
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

  const response = await passkeys.create(json)
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

  return credential as unknown as OxWebAuthn.Credential
}

export async function getFn(
  options?: OxWebAuthn.CredentialRequestOptions,
): Promise<OxWebAuthn.Credential | null> {
  const passkeys = assertPasskeys()
  const publicKey =
    options?.publicKey || (options as PublicKeyCredentialRequestOptions)

  const response = await passkeys.get({
    allowCredentials: publicKey.allowCredentials?.map((item) => ({
      ...item,
      id: bufferToBase64URL(item.id as ArrayBuffer),
    })),
    challenge: bufferToBase64URL(publicKey.challenge as ArrayBuffer),
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

  return credential as unknown as OxWebAuthn.Credential
}

function assertPasskeys(): PasskeysModule {
  if (!passkeysModule)
    throw new Error(
      'react-native-passkeys native module is unavailable. Install the module and rebuild the app.',
    )
  return passkeysModule
}

function arrayBufferToBase64URL(buffer: ArrayBuffer) {
  return Base64.fromBytes(new Uint8Array(buffer), { url: true })
}

function base64URLToArrayBuffer(input: string) {
  return Base64.toBytes(input)
}

function bufferToBase64URL(input: BufferSource) {
  return btoa(
    String.fromCharCode(
      ...(input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : new Uint8Array(input.buffer, input.byteOffset, input.byteLength)),
    ),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
