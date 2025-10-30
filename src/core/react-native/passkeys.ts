import { Base64 } from 'ox'
import type * as PasskeysModule_ from 'react-native-passkeys'
import type OxWebAuthn from '../../../node_modules/ox/_types/core/internal/webauthn.js'
import type { relay } from '../internal/modes/relay.js'
import { loadNativeModule } from './nativeModule.js'

type RelayParameters = NonNullable<Parameters<typeof relay>[number]>

export type PasskeysModule = typeof PasskeysModule_
let passkeysModule: PasskeysModule | null | undefined

type PasskeysCreateRequest = Parameters<PasskeysModule['create']>[number]
type PasskeysGetRequest = Parameters<PasskeysModule['get']>[number]
type PasskeysCreateExtensions = NonNullable<PasskeysCreateRequest['extensions']>
type PasskeysGetExtensions = NonNullable<PasskeysGetRequest['extensions']>
type PasskeysPrfInputs = NonNullable<PasskeysCreateExtensions['prf']>

function loadPasskeys(): PasskeysModule | null {
  if (passkeysModule !== undefined) return passkeysModule
  passkeysModule =
    loadNativeModule<PasskeysModule>('react-native-passkeys') ?? null
  return passkeysModule
}

function loadPasskeysStrict(): PasskeysModule {
  const module = loadPasskeys()
  if (!module || typeof module.create !== 'function')
    throw new Error(
      'react-native-passkeys native module is unavailable. Ensure pods are installed / Gradle is synced and rebuild the app.',
    )
  return module
}

export function createPasskeyAdapter(options?: {
  keyStoreHost?: string | undefined
  passkeysModule?: PasskeysModule | null | undefined
  webAuthn?: RelayParameters['webAuthn']
}) {
  ensureSubtleCrypto()

  if (options && 'passkeysModule' in options)
    passkeysModule = options.passkeysModule ?? passkeysModule

  const keystoreHost = normalizeKeyStoreHost(
    options?.keyStoreHost ??
      process.env.EXPO_PUBLIC_PORTO_KEYSTORE_HOST ??
      process.env.PORTO_KEYSTORE_HOST ??
      undefined,
  )

  const passkeys = loadPasskeys()
  if (!passkeys || typeof passkeys.create !== 'function')
    console.warn(
      '[porto][react-native][passkeys] react-native-passkeys native module is not available – WebAuthn requests will fail until the module is installed (pod install / Gradle sync) and the app is rebuilt.',
    )

  const webAuthnOverrides = options?.webAuthn

  return {
    keystoreHost,
    webAuthn: {
      async createFn(
        options?: OxWebAuthn.CredentialCreationOptions,
      ): Promise<OxWebAuthn.Credential | null> {
        if (webAuthnOverrides?.createFn)
          return webAuthnOverrides.createFn(options) as never

        const passkeys = loadPasskeysStrict()
        const maybePublicKey = options?.publicKey ?? options
        if (!isPublicKeyCredentialCreationOptions(maybePublicKey)) return null
        const publicKey = maybePublicKey
        const request: Parameters<typeof passkeys.create>[number] = {
          challenge: toBase64Url(publicKey.challenge),
          pubKeyCredParams: publicKey.pubKeyCredParams ?? [],
          rp: publicKey.rp,
          user: {
            ...publicKey.user,
            id: toBase64Url(publicKey.user.id),
          },
        }

        const excludeCredentials = publicKey.excludeCredentials?.map(
          (credential) => ({
            ...credential,
            id: toBase64Url(credential.id),
          }),
        )
        if (excludeCredentials) request.excludeCredentials = excludeCredentials
        if (publicKey.attestation !== undefined)
          request.attestation = publicKey.attestation
        if (publicKey.authenticatorSelection !== undefined)
          request.authenticatorSelection = publicKey.authenticatorSelection
        const extensions = convertCreationExtensions(publicKey.extensions)
        if (extensions) request.extensions = extensions
        if (publicKey.timeout !== undefined) request.timeout = publicKey.timeout

        if (options?.signal) request.signal = options.signal

        const response = await passkeys.create(request)
        if (!response) return null

        return {
          authenticatorAttachment: response.authenticatorAttachment ?? null,
          getClientExtensionResults: () =>
            response.clientExtensionResults ?? {},
          id: response.id,
          rawId: fromBase64Url(response.rawId),
          response: {
            attestationObject: fromBase64Url(
              response.response.attestationObject,
            ),
            clientDataJSON: fromBase64Url(response.response.clientDataJSON),
            getAuthenticatorData: () => new ArrayBuffer(0),
            getPublicKey: () => response.response.getPublicKey?.() ?? null,
            getPublicKeyAlgorithm: () => -7,
            getTransports: () => [],
          },
          type: response.type,
        } as unknown as OxWebAuthn.Credential
      },
      async getFn(
        options?: OxWebAuthn.CredentialRequestOptions,
      ): Promise<OxWebAuthn.Credential | null> {
        if (webAuthnOverrides?.getFn)
          return webAuthnOverrides.getFn(options) as never

        const passkeys = loadPasskeysStrict()
        const maybePublicKey = options?.publicKey ?? options
        if (!isPublicKeyCredentialRequestOptions(maybePublicKey)) return null
        const publicKey = maybePublicKey

        const request: Parameters<typeof passkeys.get>[number] = {
          challenge: toBase64Url(publicKey.challenge),
        }
        const allowCredentials = publicKey.allowCredentials?.map(
          (credential) => ({
            ...credential,
            id: toBase64Url(credential.id),
          }),
        )
        if (allowCredentials) request.allowCredentials = allowCredentials
        const extensions = convertRequestExtensions(publicKey.extensions)
        if (extensions) request.extensions = extensions
        if (publicKey.rpId !== undefined) request.rpId = publicKey.rpId
        if (publicKey.timeout !== undefined) request.timeout = publicKey.timeout
        if (publicKey.userVerification !== undefined)
          request.userVerification = publicKey.userVerification

        const response = await passkeys.get(request)

        if (!response) return null

        return {
          authenticatorAttachment: response.authenticatorAttachment ?? null,
          getClientExtensionResults: () =>
            response.clientExtensionResults ?? {},
          id: response.id,
          rawId: fromBase64Url(response.rawId),
          response: {
            authenticatorData: fromBase64Url(
              response.response.authenticatorData,
            ),
            clientDataJSON: fromBase64Url(response.response.clientDataJSON),
            signature: fromBase64Url(response.response.signature),
            userHandle: response.response.userHandle
              ? fromBase64Url(response.response.userHandle)
              : null,
          },
          type: response.type,
        } as unknown as OxWebAuthn.Credential
      },
    },
  }
}

function ensureSubtleCrypto() {
  if (typeof globalThis.crypto === 'undefined') return
  const crypto = globalThis.crypto as { subtle?: Record<string, any> }
  const subtle = (crypto.subtle ??= {} as Record<string, any>)

  if (typeof subtle.importKey !== 'function')
    subtle.importKey = async (format: string) => {
      if (format !== 'spki') throw new Error('Unsupported key format')
      const error = new Error('Permission denied to access object')
      throw error
    }

  if (typeof subtle.exportKey !== 'function')
    subtle.exportKey = async (format: string, key: { raw?: Uint8Array }) => {
      if (format !== 'raw' || !key?.raw)
        throw new Error('Unsupported key export')
      return key.raw.buffer.slice(0)
    }

  crypto.subtle = subtle
}

function convertCreationExtensions(
  extensions: OxWebAuthn.PublicKeyCredentialCreationOptions['extensions'],
): PasskeysCreateExtensions | undefined {
  if (!extensions) return undefined
  const next: PasskeysCreateExtensions = {}

  if (typeof (extensions as { credProps?: unknown }).credProps === 'boolean')
    next.credProps = (extensions as { credProps: boolean }).credProps

  const largeBlob = (extensions as { largeBlob?: unknown }).largeBlob as
    | {
        read?: boolean
        support?: 'preferred' | 'required'
        write?: OxWebAuthn.BufferSource
      }
    | undefined
  if (largeBlob) {
    next.largeBlob = {
      ...(largeBlob.read !== undefined ? { read: largeBlob.read } : {}),
      ...(largeBlob.support !== undefined
        ? { support: largeBlob.support }
        : {}),
      ...(largeBlob.write !== undefined
        ? { write: toBase64Url(largeBlob.write) }
        : {}),
    }
  }

  const prfInputs = (
    extensions as {
      prf?: OxWebAuthn.AuthenticationExtensionsClientInputs['prf']
    }
  ).prf
  const prf = convertPrfInputs(prfInputs)
  if (prf) next.prf = prf

  return Object.keys(next).length > 0 ? next : undefined
}

function convertRequestExtensions(
  extensions: OxWebAuthn.PublicKeyCredentialRequestOptions['extensions'],
): PasskeysGetExtensions | undefined {
  if (!extensions) return undefined
  const next: PasskeysGetExtensions = {}

  const largeBlob = (extensions as { largeBlob?: unknown }).largeBlob as
    | {
        read?: boolean
        support?: 'preferred' | 'required'
        write?: OxWebAuthn.BufferSource
      }
    | undefined
  if (largeBlob) {
    next.largeBlob = {
      ...(largeBlob.read !== undefined ? { read: largeBlob.read } : {}),
      ...(largeBlob.support !== undefined
        ? { support: largeBlob.support }
        : {}),
      ...(largeBlob.write !== undefined
        ? { write: toBase64Url(largeBlob.write) }
        : {}),
    }
  }

  const prfInputs = (
    extensions as {
      prf?: OxWebAuthn.AuthenticationExtensionsClientInputs['prf']
    }
  ).prf
  const prf = convertPrfInputs(prfInputs)
  if (prf) next.prf = prf

  return Object.keys(next).length > 0 ? next : undefined
}

function convertPrfInputs(
  inputs: OxWebAuthn.AuthenticationExtensionsClientInputs['prf'],
): PasskeysPrfInputs | undefined {
  if (!inputs) return undefined
  if (typeof inputs !== 'object') return undefined
  if ((inputs as { prfKey?: unknown }).prfKey !== undefined) return undefined

  const prf: PasskeysPrfInputs = {}
  const { eval: evalInput, evalByCredential } = inputs as {
    eval?: {
      first: OxWebAuthn.BufferSource
      second?: OxWebAuthn.BufferSource
    }
    evalByCredential?: Record<
      string,
      {
        first: OxWebAuthn.BufferSource
        second?: OxWebAuthn.BufferSource
      }
    >
  }

  if (evalInput) {
    prf.eval = {
      first: toBase64Url(evalInput.first),
      ...(evalInput.second !== undefined
        ? { second: toBase64Url(evalInput.second) }
        : {}),
    }
  }

  if (evalByCredential) {
    prf.evalByCredential = Object.fromEntries(
      Object.entries(evalByCredential).map(([key, value]) => [
        key,
        {
          first: toBase64Url(value.first),
          ...(value.second !== undefined
            ? { second: toBase64Url(value.second) }
            : {}),
        },
      ]),
    )
  }

  return prf.eval || prf.evalByCredential ? prf : undefined
}

function fromBase64Url(value: string) {
  return Base64.toBytes(value)
}

function normalizeKeyStoreHost(host: string | undefined) {
  if (!host) return undefined
  try {
    const { hostname } = new URL(host)
    if (hostname) return hostname
  } catch {
    // not a URL, fall through
  }
  return host.replace(/^https?:\/\//, '').split('/')[0] || undefined
}

function isPublicKeyCredentialCreationOptions(
  value: unknown,
): value is PublicKeyCredentialCreationOptions {
  if (!value || typeof value !== 'object') return false
  const options = value as PublicKeyCredentialCreationOptions
  return (
    isBufferSource(options.challenge) &&
    typeof options.rp === 'object' &&
    options.rp !== null &&
    typeof options.user === 'object' &&
    options.user !== null &&
    isBufferSource(options.user.id)
  )
}

function isPublicKeyCredentialRequestOptions(
  value: unknown,
): value is PublicKeyCredentialRequestOptions {
  if (!value || typeof value !== 'object') return false
  const options = value as PublicKeyCredentialRequestOptions
  return isBufferSource(options.challenge)
}

function toBase64Url(value: OxWebAuthn.BufferSource) {
  const bytes =
    value instanceof ArrayBuffer
      ? new Uint8Array(value)
      : new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  return Base64.fromBytes(bytes, { url: true })
}

type PublicKeyCredentialCreationOptions = NonNullable<
  OxWebAuthn.CredentialCreationOptions['publicKey']
>

type PublicKeyCredentialRequestOptions = NonNullable<
  OxWebAuthn.CredentialRequestOptions['publicKey']
>

function isBufferSource(value: unknown): value is OxWebAuthn.BufferSource {
  if (value instanceof ArrayBuffer) return true
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(value)
}
