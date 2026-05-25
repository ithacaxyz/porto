import { Bytes } from 'ox'
import { afterEach, describe, expect, test, vi } from 'vitest'
import * as Key from './Key.js'

const publicKeyBytes = [
  48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134, 72, 206, 61,
  3, 1, 7, 3, 66, 0, 4, 171, 137, 20, 0, 20, 15, 196, 248, 233, 65, 206, 15,
  249, 14, 65, 157, 233, 71, 10, 202, 202, 97, 59, 189, 113, 122, 71, 117, 67,
  80, 49, 167, 216, 132, 49, 142, 145, 159, 211, 179, 229, 166, 49, 216, 102,
  216, 163, 128, 180, 64, 99, 231, 15, 12, 56, 30, 225, 110, 6, 82, 247, 249,
  117, 84,
]

describe('createWebAuthnP256 PRF', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('behavior: requests prf registration without create-time eval', async () => {
    stubWindow()
    let options: CredentialCreationOptions | undefined

    const key = await Key.createWebAuthnP256({
      createFn(options_) {
        options = options_ as CredentialCreationOptions
        return Promise.resolve({
          id: 'm1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs',
          response: {
            getPublicKey() {
              return publicKeyBytes
            },
          },
        } as any)
      },
      label: 'test',
      prf: true,
      userId: Bytes.from('0x0000000000000000000000000000000000000000'),
    })

    const prf = (options?.publicKey?.extensions as any).prf
    expect(prf).toEqual({})
    expect(prf.eval).toBeUndefined()
    expect(prf.evalByCredential).toBeUndefined()
    expect((key.privateKey as any)?.prf).toEqual({ enabled: false })
  })

  test('behavior: preserves default signature option shape when PRF is not requested', async () => {
    stubWindow()
    let options: CredentialCreationOptions | undefined

    await Key.createWebAuthnP256({
      createFn(options_) {
        options = options_ as CredentialCreationOptions
        return Promise.resolve({
          id: 'm1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs',
          response: {
            getPublicKey() {
              return publicKeyBytes
            },
          },
        } as any)
      },
      label: 'test',
      userId: Bytes.from('0x0000000000000000000000000000000000000000'),
    })

    expect(options?.publicKey?.extensions).toEqual({ credProps: true })
  })
})

function stubWindow() {
  vi.stubGlobal('window', {
    document: {
      title: 'Porto',
    },
    location: {
      hostname: 'account.example',
    },
  })
}
