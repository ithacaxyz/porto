import * as Address from 'ox/Address'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'

const metadataKey = 'porto.dialog.prfCredentials'
const pendingMetadataKey = 'porto.dialog.pendingPrfCredential'
const hkdfSalt = 'porto-app-prf-v1'

type CreateCredentialFn = NonNullable<
  WebAuthnP256.createCredential.Options['createFn']
>

type PrfValues = {
  first: BufferSource
  second?: BufferSource | undefined
}

type PrfOutputs = {
  enabled?: boolean | undefined
  results?:
    | {
        first?: BufferSource | Record<string, unknown> | undefined
        second?: BufferSource | Record<string, unknown> | undefined
      }
    | undefined
  resultsByCredential?:
    | Record<
        string,
        {
          first?: BufferSource | Record<string, unknown> | undefined
          second?: BufferSource | Record<string, unknown> | undefined
        }
      >
    | undefined
}

type PublicKeyCredentialLike = Credential & {
  id: string
  rawId: BufferSource
  getClientExtensionResults: () => AuthenticationExtensionsClientOutputs & {
    prf?: PrfOutputs | undefined
  }
}

type AccountWithKeys = {
  address: Address.Address
  keys?: readonly AccountKey[]
}

type AccountKey = {
  credentialId?: string | undefined
  privateKey?: unknown
  type?: string | undefined
}

type WebAuthnPrivateKey = {
  credential?: { id?: string | undefined } | undefined
  prf?: { enabled?: boolean | undefined } | undefined
  rpId?: string | undefined
}

export type Metadata = {
  account: Address.Address
  credentialId: string
  rpId: string
  prfEnabled: boolean
  updatedAt: number
}

type PendingMetadata = Omit<Metadata, 'account'>

type PrfOutput = {
  bytes: Uint8Array
  source: string
}

export const create: CreateCredentialFn = async (options) => {
  const credentialOptions = (options ?? {}) as CredentialCreationOptions
  if (!credentialOptions.publicKey)
    return navigator.credentials.create(credentialOptions)

  const publicKey = credentialOptions.publicKey
  const next = {
    ...credentialOptions,
    publicKey: {
      ...publicKey,
      extensions: {
        ...publicKey.extensions,
        prf: {},
      } as AuthenticationExtensionsClientInputs,
    },
  } satisfies CredentialCreationOptions

  const credential = await navigator.credentials.create(next)
  if (!isPublicKeyCredentialLike(credential)) return credential

  const prfOutputs = credential.getClientExtensionResults().prf
  const createReportedPrfEnabled = prfWasEnabled(prfOutputs)
  let prfEnabled = createReportedPrfEnabled
  clearPrfOutputs(prfOutputs)

  if (!prfEnabled) {
    prfEnabled = await probeCredentialPrf({
      credential,
      rpId: publicKey.rp.id ?? window.location.hostname,
    }).catch(() => false)
  }

  storePendingMetadata({
    credentialId:
      credential.id || base64UrlEncode(copyBufferSource(credential.rawId)),
    prfEnabled,
    rpId: publicKey.rp.id ?? window.location.hostname,
    updatedAt: Date.now(),
  })

  if (!createReportedPrfEnabled && prfEnabled)
    return withPrfEnabledResult(credential)

  return credential
}

export function recordConnectResult(response: unknown): void {
  const pending = loadPendingMetadata()
  if (!pending) return

  const account = extractConnectedAccount(response, pending.credentialId)
  if (!account) return

  const next: Metadata = {
    ...pending,
    account,
    updatedAt: Date.now(),
  }
  recordAccountMetadata(next)
  window.localStorage.removeItem(pendingMetadataKey)
}

export function recordAccountMetadata(metadata: Metadata): void {
  const records = loadMetadata()
  records[metadata.account.toLowerCase() as Address.Address] = {
    ...metadata,
    credentialId: normalizeBase64Url(metadata.credentialId),
    updatedAt: Date.now(),
  }
  window.localStorage.setItem(metadataKey, JSON.stringify(records))
}

export function loadAccountMetadata(
  account: Address.Address,
): Metadata | undefined {
  return loadMetadata()[account.toLowerCase() as Address.Address]
}

export function resolveAccountMetadata(
  account: AccountWithKeys,
): Metadata | undefined {
  const stored = loadAccountMetadata(account.address)
  const recovered = recoverAccountMetadata(account)
  if (!stored) return recovered
  if (!recovered) return stored

  if (
    normalizeBase64Url(stored.credentialId) ===
      normalizeBase64Url(recovered.credentialId) &&
    stored.rpId === recovered.rpId
  )
    return stored

  return recovered
}

export function recoverAccountMetadata(
  account: AccountWithKeys,
): Metadata | undefined {
  const candidates = account.keys?.filter(
    (key) => key.type === 'webauthn-p256' && getKeyCredentialId(key),
  )
  const key =
    candidates?.find((key) => getKeyPrfEnabled(key) === true) ?? candidates?.[0]
  if (!key) return undefined
  const credentialId = getKeyCredentialId(key)
  if (!credentialId) return undefined

  return {
    account: account.address,
    credentialId: normalizeBase64Url(credentialId),
    prfEnabled: getKeyPrfEnabled(key) === true,
    rpId: getKeyRpId(key),
    updatedAt: Date.now(),
  }
}

export function validateAppReferrer(input: {
  origin?: string | undefined
  url?: URL | undefined
}): string {
  if (!input.origin || !input.url)
    throw new Error('Missing application origin for PRF request.')
  if (input.url.origin !== input.origin)
    throw new Error('Application origin/referrer mismatch.')
  return input.origin
}

export function assertAccountCredentialBinding(input: {
  account: AccountWithKeys
  metadata: Metadata
}): void {
  if (!Address.isEqual(input.account.address, input.metadata.account))
    throw new Error('Stored PRF account does not match selected account.')

  const credentialId = normalizeBase64Url(input.metadata.credentialId)
  const key = input.account.keys?.find((key) => {
    const keyCredentialId = getKeyCredentialId(key)
    return (
      key.type === 'webauthn-p256' &&
      keyCredentialId &&
      normalizeBase64Url(keyCredentialId) === credentialId
    )
  })
  if (!key) throw new Error('Selected account does not own the PRF credential.')

  if (getKeyRpId(key) !== input.metadata.rpId)
    throw new Error('Stored PRF RP ID does not match selected account key.')
}

export async function getAppPrf(input: {
  account: Address.Address
  appOrigin: string
  credentialId: string
  purpose: string
  rpId: string
  salt: string
  vaultId: string
}): Promise<string> {
  assertPrfEnvironment()
  validatePurpose(input.purpose)
  validateVaultId(input.vaultId)

  const salt = base64UrlDecode(input.salt)
  if (salt.byteLength !== 32)
    throw new Error('Invalid PRF salt. Expected base64url-encoded 32 bytes.')

  const credentialId = normalizeBase64Url(input.credentialId)
  const credentialIdBytes = base64UrlDecode(credentialId)
  if (credentialIdBytes.byteLength === 0)
    throw new Error('Stored credential ID decoded to zero bytes.')

  const assertion = await getPrfAssertion({
    credentialId,
    credentialIdBytes,
    rpId: input.rpId,
    salt,
  })

  if (!isPublicKeyCredentialLike(assertion))
    throw new Error('WebAuthn did not return a public key assertion.')

  if (assertion.id && normalizeBase64Url(assertion.id) !== credentialId)
    throw new Error('WebAuthn assertion credential ID did not match.')

  const prfOutputs = assertion.getClientExtensionResults().prf
  const prfOutput = extractPrfOutput(prfOutputs, credentialId)
  if (!prfOutput)
    throw new Error(
      `No byte PRF output returned. Output shape: ${describePrfOutputs(
        prfOutputs,
        credentialId,
      )}`,
    )

  clearPrfOutputs(prfOutputs)

  try {
    const derived = await deriveAppScopedPrf({
      account: input.account,
      appOrigin: input.appOrigin,
      credentialId,
      purpose: input.purpose,
      rawPrf: prfOutput.bytes,
      rpId: input.rpId,
      vaultId: input.vaultId,
    })
    return base64UrlEncode(derived)
  } finally {
    prfOutput.bytes.fill(0)
  }
}

export function isClientPrfCapable(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof navigator?.credentials?.create === 'function' &&
    typeof navigator?.credentials?.get === 'function' &&
    typeof crypto?.subtle?.deriveBits === 'function'
  )
}

export function getCapabilityStatus(parameters?: {
  account?: string | undefined
  keys?: readonly unknown[] | undefined
}): 'unsupported' | 'credential-not-enabled' | 'enabled' {
  if (!isClientPrfCapable()) return 'unsupported'

  if (parameters?.account && Address.validate(parameters.account)) {
    if (parameters.keys) {
      const recovered = recoverAccountMetadata({
        address: parameters.account,
        keys: parameters.keys as readonly AccountKey[] | undefined,
      })
      if (!recovered) return 'credential-not-enabled'
    }

    const metadata = resolveAccountMetadata({
      address: parameters.account,
      keys: parameters.keys as readonly AccountKey[] | undefined,
    })
    if (metadata?.prfEnabled) return 'enabled'
    if (metadata) return 'credential-not-enabled'
  }

  const metadata = parameters?.account
    ? [loadAccountMetadata(parameters.account as Address.Address)].filter(
        (record): record is Metadata => Boolean(record),
      )
    : Object.values(loadMetadata())
  if (metadata.some((record) => record.prfEnabled)) return 'enabled'
  return 'credential-not-enabled'
}

function getKeyCredentialId(key: AccountKey): string | undefined {
  const privateKey = key.privateKey as WebAuthnPrivateKey | undefined
  return privateKey?.credential?.id ?? key.credentialId
}

function getKeyPrfEnabled(key: AccountKey): boolean | undefined {
  const privateKey = key.privateKey as WebAuthnPrivateKey | undefined
  return privateKey?.prf?.enabled
}

function getKeyRpId(key: AccountKey): string {
  const privateKey = key.privateKey as WebAuthnPrivateKey | undefined
  return privateKey?.rpId ?? currentRpId()
}

function currentRpId(): string {
  const hostname = window.location.hostname
  if (!hostname) throw new Error('Unable to determine WebAuthn RP ID.')
  return hostname
}

function extractConnectedAccount(
  response: unknown,
  credentialId: string,
): Address.Address | undefined {
  const accounts = (response as { accounts?: unknown[] } | undefined)?.accounts
  if (!Array.isArray(accounts)) return undefined

  const normalizedCredentialId = normalizeBase64Url(credentialId)
  for (const account of accounts) {
    const address = (account as { address?: unknown }).address
    if (typeof address !== 'string' || !Address.validate(address)) continue

    const admins = (account as { capabilities?: { admins?: unknown[] } })
      .capabilities?.admins
    if (!Array.isArray(admins)) continue

    const hasCredential = admins.some((admin) => {
      const value = (admin as { credentialId?: unknown }).credentialId
      return (
        typeof value === 'string' &&
        normalizeBase64Url(value) === normalizedCredentialId
      )
    })
    if (hasCredential) return address
  }

  return undefined
}

async function getPrfAssertion(input: {
  credentialId: string
  credentialIdBytes: Uint8Array
  rpId: string
  salt: Uint8Array
}): Promise<Credential | null> {
  const basePublicKey = {
    allowCredentials: [
      {
        id: toArrayBuffer(input.credentialIdBytes),
        type: 'public-key' as const,
      },
    ],
    challenge: randomBytes(32),
    rpId: input.rpId,
    timeout: 60_000,
    userVerification: 'required' as const,
  }

  try {
    return await navigator.credentials.get({
      publicKey: {
        ...basePublicKey,
        extensions: {
          prf: createPrfRequestInput({
            credentialId: input.credentialId,
            first: input.salt,
          }),
        } as AuthenticationExtensionsClientInputs,
      },
    })
  } catch (error) {
    if (!shouldRetryPrfWithEval(error)) throw error
    return await navigator.credentials.get({
      publicKey: {
        ...basePublicKey,
        extensions: {
          prf: createPrfEvalInput({ first: input.salt }),
        } as AuthenticationExtensionsClientInputs,
      },
    })
  }
}

async function probeCredentialPrf(input: {
  credential: PublicKeyCredentialLike
  rpId: string
}): Promise<boolean> {
  const salt = randomBytes(32)
  const assertion = await getPrfAssertion({
    credentialId: input.credential.id,
    credentialIdBytes: copyBufferSource(input.credential.rawId),
    rpId: input.rpId,
    salt,
  })
  if (!isPublicKeyCredentialLike(assertion)) return false

  const prfOutputs = assertion.getClientExtensionResults().prf
  const enabled = prfWasEnabled(prfOutputs)
  clearPrfOutputs(prfOutputs)
  return enabled
}

async function deriveAppScopedPrf(input: {
  account: Address.Address
  appOrigin: string
  credentialId: string
  purpose: string
  rawPrf: Uint8Array
  rpId: string
  vaultId: string
}): Promise<ArrayBuffer> {
  if (input.rawPrf.byteLength !== 32)
    throw new Error(
      `Raw WebAuthn PRF output was ${input.rawPrf.byteLength} bytes; expected 32 bytes.`,
    )

  const key = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(input.rawPrf),
    'HKDF',
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    {
      hash: 'SHA-256',
      info: toArrayBuffer(
        utf8(
          [
            input.appOrigin,
            `purpose:${input.purpose}`,
            `vault:${input.vaultId}`,
            `account:${input.account.toLowerCase()}`,
            `rp:${input.rpId}`,
            `credential:${input.credentialId}`,
          ].join('|'),
        ),
      ),
      name: 'HKDF',
      salt: toArrayBuffer(utf8(hkdfSalt)),
    },
    key,
    256,
  )
}

function createPrfRequestInput(input: {
  credentialId: string
  first: Uint8Array
}): { evalByCredential: Record<string, PrfValues> } {
  return {
    evalByCredential: {
      [input.credentialId]: { first: toArrayBuffer(copyBytes(input.first)) },
    },
  }
}

function createPrfEvalInput(input: { first: Uint8Array }): {
  eval: PrfValues
} {
  return { eval: { first: toArrayBuffer(copyBytes(input.first)) } }
}

function extractPrfOutput(
  outputs: PrfOutputs | undefined,
  credentialId: string,
): PrfOutput | null {
  return (
    normalizePrfOutput(
      outputs?.resultsByCredential?.[credentialId]?.first,
      'resultsByCredential[credentialId].first',
    ) ?? normalizePrfOutput(outputs?.results?.first, 'results.first')
  )
}

function normalizePrfOutput(value: unknown, source: string): PrfOutput | null {
  if (value instanceof ArrayBuffer) return { bytes: copyBytes(value), source }
  if (ArrayBuffer.isView(value))
    return {
      bytes: copyBytes(
        new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
      ),
      source,
    }

  const plainBytes = copyPlainNumericByteObject(value)
  if (plainBytes) return { bytes: plainBytes, source }
  return null
}

function copyPlainNumericByteObject(value: unknown): Uint8Array | null {
  if (typeof value !== 'object' || value === null) return null
  const keys = Object.keys(value)
  if (keys.length === 0) return null

  const indexes = keys
    .map((key) => Number(key))
    .sort((left, right) => left - right)
  if (
    indexes.some(
      (index, position) =>
        !Number.isInteger(index) || index < 0 || index !== position,
    )
  )
    return null

  const record = value as Record<string, unknown>
  const bytes = new Uint8Array(indexes.length)
  for (const index of indexes) {
    const byte = record[String(index)]
    if (
      typeof byte !== 'number' ||
      !Number.isInteger(byte) ||
      byte < 0 ||
      byte > 255
    )
      return null
    bytes[index] = byte
  }
  return bytes
}

function describePrfOutputs(
  outputs: PrfOutputs | undefined,
  credentialId: string,
): string {
  if (!outputs) return 'none'
  const credentialResults = outputs.resultsByCredential?.[credentialId]
  return [
    `enabled:${outputs.enabled === true ? 'true' : String(outputs.enabled)}`,
    `results.first:${describePrfValue(outputs.results?.first)}`,
    `resultsByCredential:${outputs.resultsByCredential ? Object.keys(outputs.resultsByCredential).length : 0}`,
    `resultsByCredential[credential].first:${describePrfValue(
      credentialResults?.first,
    )}`,
    `keys:${Object.keys(outputs).sort().join(',') || 'none'}`,
  ].join('; ')
}

function describePrfValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (value instanceof ArrayBuffer) return `ArrayBuffer(${value.byteLength})`
  if (ArrayBuffer.isView(value))
    return `${value.constructor.name}(${value.byteLength})`
  if (copyPlainNumericByteObject(value))
    return `numeric-byte-object(${Object.keys(value as object).length})`
  return typeof value
}

function prfWasEnabled(outputs?: PrfOutputs): boolean {
  return (
    outputs?.enabled === true ||
    outputs?.results?.first !== undefined ||
    Object.keys(outputs?.resultsByCredential ?? {}).length > 0
  )
}

function withPrfEnabledResult(
  credential: PublicKeyCredentialLike,
): PublicKeyCredentialLike {
  return new Proxy(credential, {
    get(target, property, receiver) {
      if (property === 'getClientExtensionResults') {
        return () => {
          const results = target.getClientExtensionResults()
          return {
            ...results,
            prf: {
              ...results.prf,
              enabled: true,
            },
          }
        }
      }
      return Reflect.get(target, property, receiver)
    },
  })
}

function clearPrfOutputs(outputs?: PrfOutputs): void {
  clearMaybeBuffer(outputs?.results?.first)
  clearMaybeBuffer(outputs?.results?.second)
  for (const values of Object.values(outputs?.resultsByCredential ?? {})) {
    clearMaybeBuffer(values.first)
    clearMaybeBuffer(values.second)
  }
}

function clearMaybeBuffer(
  value: BufferSource | Record<string, unknown> | undefined,
): void {
  if (!value) return
  if (value instanceof ArrayBuffer) {
    new Uint8Array(value).fill(0)
    return
  }
  if (ArrayBuffer.isView(value)) {
    new Uint8Array(value.buffer, value.byteOffset, value.byteLength).fill(0)
    return
  }
  for (const key of Object.keys(value)) if (/^\d+$/.test(key)) value[key] = 0
}

function isPublicKeyCredentialLike(
  credential: Credential | null,
): credential is PublicKeyCredentialLike {
  const candidate = credential as Partial<PublicKeyCredentialLike> | null
  return Boolean(
    candidate &&
      candidate.type === 'public-key' &&
      isBufferSource(candidate.rawId) &&
      typeof candidate.getClientExtensionResults === 'function',
  )
}

function shouldRetryPrfWithEval(error: unknown): boolean {
  return (
    isDomExceptionNamed(error, 'DataError') ||
    isDomExceptionNamed(error, 'SyntaxError') ||
    isDomExceptionNamed(error, 'NotSupportedError')
  )
}

function isDomExceptionNamed(error: unknown, name: string): boolean {
  if (error instanceof DOMException) return error.name === name
  return error instanceof Error && error.name === name
}

function storePendingMetadata(metadata: PendingMetadata): void {
  window.localStorage.setItem(pendingMetadataKey, JSON.stringify(metadata))
}

function loadPendingMetadata(): PendingMetadata | undefined {
  const raw = window.localStorage.getItem(pendingMetadataKey)
  if (!raw) return undefined
  return JSON.parse(raw) as PendingMetadata
}

function loadMetadata(): Record<Address.Address, Metadata> {
  const raw = window.localStorage.getItem(metadataKey)
  if (!raw) return {}
  return JSON.parse(raw) as Record<Address.Address, Metadata>
}

function assertPrfEnvironment(): void {
  if (!window.isSecureContext)
    throw new Error('This page is not running in a secure context.')
  if (!navigator.credentials)
    throw new Error('WebAuthn is not available in this browser.')
  if (!crypto.subtle || typeof crypto.getRandomValues !== 'function')
    throw new Error('WebCrypto is not available in this browser.')
}

function validatePurpose(purpose: string): void {
  if (!/^[A-Za-z0-9:_./-]{1,128}$/.test(purpose))
    throw new Error('Invalid PRF purpose.')
}

function validateVaultId(vaultId: string): void {
  if (!/^[A-Za-z0-9:_./-]{1,128}$/.test(vaultId))
    throw new Error('Invalid vault ID.')
}

function normalizeBase64Url(value: string): string {
  if (!value || value !== value.trim())
    throw new Error('Invalid base64url value.')
  if (!/^[A-Za-z0-9_-]+={0,2}$/.test(value))
    throw new Error('Invalid base64url value.')
  if (/=/.test(value.replace(/=+$/, '')))
    throw new Error('Invalid base64url padding.')
  const unpadded = value.replace(/=+$/, '')
  if (unpadded.length % 4 === 1) throw new Error('Invalid base64url length.')
  return unpadded
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ''
  for (let index = 0; index < view.length; index += 0x8000) {
    const chunk = view.subarray(index, index + 0x8000)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function base64UrlDecode(value: string): Uint8Array<ArrayBuffer> {
  const normalized = normalizeBase64Url(value)
  const base64 = normalized.replaceAll('-', '+').replaceAll('_', '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1)
    bytes[index] = binary.charCodeAt(index)
  return bytes
}

function copyBytes(value: ArrayBuffer | Uint8Array): Uint8Array<ArrayBuffer> {
  const view = value instanceof Uint8Array ? value : new Uint8Array(value)
  const bytes = new Uint8Array(new ArrayBuffer(view.byteLength))
  bytes.set(view)
  return bytes
}

function copyBufferSource(value: BufferSource): Uint8Array<ArrayBuffer> {
  if (value instanceof ArrayBuffer) return copyBytes(value)
  return copyBytes(
    new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
  )
}

function isBufferSource(value: unknown): value is BufferSource {
  return value instanceof ArrayBuffer || ArrayBuffer.isView(value)
}

function randomBytes(size: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(new ArrayBuffer(size)))
}

function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength,
  ) as ArrayBuffer
}

function utf8(value: string): Uint8Array<ArrayBuffer> {
  return copyBytes(new TextEncoder().encode(value))
}
