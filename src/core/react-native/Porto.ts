import { Base64 } from 'ox'
import * as Passkeys from 'react-native-passkeys'
import type { ExactPartial } from '../internal/types.js'
import * as Mode from '../Mode.js'
import * as Porto from '../Porto.js'

export const defaultConfig = {
  ...Porto.defaultConfig,
  mode: Mode.reactNative(),
} as const satisfies Partial<Porto.Config>

/**
 * Instantiates a Porto instance with React Native mode.
 */
export function create(
  parameters: ExactPartial<Porto.Config> | undefined = {},
): Porto.Porto {
  const { keystoreHost, webAuthn } = createReactNativePasskeyAdapter()

  if (parameters?.mode)
    return Porto.create({ ...parameters, mode: parameters.mode })
  const mode = Mode.reactNative({
    fallback: Mode.relay({
      ...(keystoreHost ? { keystoreHost } : {}),
      webAuthn,
    }),
  })

  return Porto.create({
    ...parameters,
    mode,
  })
}

function createReactNativePasskeyAdapter<
  P extends NonNullable<Parameters<typeof Mode.relay>[number]>,
>(): {
  keystoreHost?: P['keystoreHost']
  webAuthn: NonNullable<P['webAuthn']>
} {
  const keystoreHost =
    getEnv('EXPO_PUBLIC_PORTO_KEYSTORE_HOST') ??
    getEnv('PORTO_KEYSTORE_HOST') ??
    undefined

  return {
    keystoreHost,
    webAuthn: {
      async createFn(options) {
        const maybePublicKey = options?.publicKey ?? options

        if (!isPublicKeyCredentialCreationOptions(maybePublicKey)) return null
        const publicKey = maybePublicKey

        const request: Parameters<typeof Passkeys.create>[number] = {
          challenge: toBase64Url(publicKey.challenge),
          pubKeyCredParams: publicKey.pubKeyCredParams,
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

        const response = await Passkeys.create(request)

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
            getPublicKey: () => {
              const publicKey_ = response.response.getPublicKey?.()
              return publicKey_ ?? null
            },
            getPublicKeyAlgorithm: () => -7,
            getTransports: () => [],
          },
          type: response.type,
        } as unknown as Credential
      },
      async getFn(options) {
        const maybePublicKey = options?.publicKey ?? options
        if (!isPublicKeyCredentialRequestOptions(maybePublicKey)) return null
        const publicKey = maybePublicKey

        const request: Parameters<typeof Passkeys.get>[number] = {
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

        const response = await Passkeys.get(request)

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
        } as unknown as Credential
      },
    },
  }
}

type PasskeyCreateExtensions = NonNullable<
  Parameters<typeof Passkeys.create>[number]['extensions']
>
type PasskeyRequestExtensions = NonNullable<
  Parameters<typeof Passkeys.get>[number]['extensions']
>
type PasskeyPrfInputs = PasskeyCreateExtensions['prf']

function convertCreationExtensions(
  extensions: unknown,
): PasskeyCreateExtensions | undefined {
  if (!extensions) return undefined
  const record = extensions as Record<string, unknown>
  const next: PasskeyCreateExtensions = {}

  if (typeof record.credProps === 'boolean') next.credProps = record.credProps

  const largeBlob = record.largeBlob as
    | {
        read?: boolean
        support?: 'preferred' | 'required'
        write?: BufferSource
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
    } as NonNullable<PasskeyCreateExtensions['largeBlob']>
  }

  const prfInputs = record.prf as Parameters<typeof convertPrfInputs>[0]
  const prf = convertPrfInputs(prfInputs)
  if (prf) next.prf = prf

  return Object.keys(next).length > 0 ? next : undefined
}

function convertRequestExtensions(
  extensions: unknown,
): PasskeyRequestExtensions | undefined {
  if (!extensions) return undefined
  const record = extensions as Record<string, unknown>
  const prfInputs = record.prf as Parameters<typeof convertPrfInputs>[0]
  const next: PasskeyRequestExtensions = {}
  if (record.largeBlob)
    next.largeBlob = record.largeBlob as NonNullable<
      PasskeyRequestExtensions['largeBlob']
    >
  const prf = convertPrfInputs(prfInputs)
  if (prf) next.prf = prf
  return Object.keys(next).length > 0 ? next : undefined
}

function convertPrfInputs(
  prf:
    | {
        eval?: { first: BufferSource; second?: BufferSource }
        evalByCredential?: Record<
          string,
          { first: BufferSource; second?: BufferSource }
        >
      }
    | undefined,
): PasskeyPrfInputs | undefined {
  if (!prf) return undefined
  const result: PasskeyPrfInputs = {}

  if (prf.eval) {
    const { first, second } = prf.eval
    result.eval = {
      first: toBase64Url(first),
      ...(second ? { second: toBase64Url(second) } : {}),
    }
  }

  if (prf.evalByCredential) {
    result.evalByCredential = Object.fromEntries(
      Object.entries(prf.evalByCredential).map(([key, value]) => [
        key,
        {
          first: toBase64Url(value.first),
          ...(value.second ? { second: toBase64Url(value.second) } : {}),
        },
      ]),
    )
  }

  return Object.keys(result).length > 0 ? result : undefined
}

function toBase64Url(value: BufferSource) {
  return Base64.fromBytes(toUint8Array(value), { url: true })
}

function fromBase64Url(value: string) {
  const bytes = Base64.toBytes(value)
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  )
}

function toUint8Array(value: ArrayBufferView | ArrayBuffer) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
}

function getEnv(key: string) {
  if (typeof process === 'undefined' || !process?.env) return undefined
  const value = process.env[key]
  return value && value.length > 0 ? value : undefined
}

function isPublicKeyCredentialCreationOptions(
  value: unknown,
): value is PublicKeyCredentialCreationOptions {
  if (!value || typeof value !== 'object') return false
  return (
    'challenge' in value &&
    'pubKeyCredParams' in value &&
    'user' in value &&
    'rp' in value
  )
}

function isPublicKeyCredentialRequestOptions(
  value: unknown,
): value is PublicKeyCredentialRequestOptions {
  if (!value || typeof value !== 'object') return false
  return 'challenge' in value
}
