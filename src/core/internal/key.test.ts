import { Bytes, Secp256k1, WebAuthnP256, WebCryptoP256 } from 'ox'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import * as Key from './key.js'

describe('createP256', () => {
  test('default', () => {
    const key = Key.createP256({
      role: 'admin',
    })

    const { publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })
})

describe('createSecp256k1', () => {
  test('default', () => {
    const key = Key.createSecp256k1({
      role: 'admin',
    })

    const { publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "role": "admin",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)
  })
})

describe('createWebAuthnP256', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {
      location: {
        hostname: 'https://example.com',
      },
      document: {
        title: 'My Website',
      },
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('default', async () => {
    const key = await Key.createWebAuthnP256({
      createFn() {
        return Promise.resolve({
          id: 'm1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs',
          response: {
            getPublicKey() {
              return [
                48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134,
                72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 171, 137, 20, 0, 20, 15, 196,
                248, 233, 65, 206, 15, 249, 14, 65, 157, 233, 71, 10, 202, 202,
                97, 59, 189, 113, 122, 71, 117, 67, 80, 49, 167, 216, 132, 49,
                142, 145, 159, 211, 179, 229, 166, 49, 216, 102, 216, 163, 128,
                180, 64, 99, 231, 15, 12, 56, 30, 225, 110, 6, 82, 247, 249,
                117, 84,
              ]
            },
          },
        } as any)
      },
      label: 'test',
      role: 'admin',
      userId: Bytes.from('0x0000000000000000000000000000000000000000'),
    })

    const { publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "role": "admin",
        "sign": [Function],
        "type": "webauthn-p256",
      }
    `)
  })
})

describe('createWebCryptoP256', () => {
  test('default', async () => {
    const key = await Key.createWebCryptoP256({
      role: 'admin',
    })

    const { publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })
})

describe('deserialize', () => {
  test('default', () => {
    const key = Key.fromP256({
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
      role: 'admin',
    })
    const serialized = Key.serialize(key)
    const deserialized = Key.deserialize(serialized)

    expect(deserialized).toEqual({
      ...key,
      sign: undefined,
    })
  })
})

describe('from', () => {
  test('default', () => {
    const publicKey = Secp256k1.getPublicKey({
      privateKey: Secp256k1.randomPrivateKey(),
    })

    const key = Key.from({
      expiry: 69420,
      publicKey,
      role: 'admin',
      type: 'p256',
    })

    expect(key).toEqual({
      expiry: 69420,
      publicKey,
      role: 'admin',
      type: 'p256',
    })
  })

  test('serialized', () => {
    const publicKey = Secp256k1.getPublicKey({
      privateKey: Secp256k1.randomPrivateKey(),
    })

    const key = Key.from({
      expiry: 69420,
      publicKey,
      role: 'admin',
      type: 'p256',
    })
    const serialized = Key.serialize(key)

    expect(Key.from(serialized)).toEqual({
      expiry: 69420,
      publicKey,
      role: 'admin',
      type: 'p256',
    })
  })
})

describe('fromP256', () => {
  test('default', () => {
    const key = Key.fromP256({
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
      role: 'admin',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": {
          "prefix": 4,
          "x": 106772332543853129808885768556237579026047721040871197501406793325324706664735n,
          "y": 110339676533900797749866890631856969312064778492080444630962038345769628880904n,
        },
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })

  test('args: expiry', () => {
    const key = Key.fromP256({
      expiry: 69420,
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
      role: 'admin',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 69420,
        "publicKey": {
          "prefix": 4,
          "x": 106772332543853129808885768556237579026047721040871197501406793325324706664735n,
          "y": 110339676533900797749866890631856969312064778492080444630962038345769628880904n,
        },
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })
})

describe('fromSecp256k1', () => {
  test('default', () => {
    const key = Key.fromSecp256k1({
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
      role: 'admin',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": {
          "prefix": 4,
          "x": 44518355604327182364128173241945023694268305939358069173831053728054854486821n,
          "y": 79963250654145194517329555417262110975421926937291144228957990645550809441590n,
        },
        "role": "admin",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)
  })
})

describe('fromWebAuthnP256', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {
      location: {
        hostname: 'https://example.com',
      },
      document: {
        title: 'My Website',
      },
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('default', async () => {
    const credential = await WebAuthnP256.createCredential({
      createFn() {
        return Promise.resolve({
          id: 'm1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs',
          response: {
            getPublicKey() {
              return [
                48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1, 6, 8, 42, 134,
                72, 206, 61, 3, 1, 7, 3, 66, 0, 4, 171, 137, 20, 0, 20, 15, 196,
                248, 233, 65, 206, 15, 249, 14, 65, 157, 233, 71, 10, 202, 202,
                97, 59, 189, 113, 122, 71, 117, 67, 80, 49, 167, 216, 132, 49,
                142, 145, 159, 211, 179, 229, 166, 49, 216, 102, 216, 163, 128,
                180, 64, 99, 231, 15, 12, 56, 30, 225, 110, 6, 82, 247, 249,
                117, 84,
              ]
            },
          },
        } as any)
      },
      name: 'test',
    })

    const key = Key.fromWebAuthnP256({
      credential,
      role: 'admin',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": {
          "prefix": 4,
          "x": 77587693192652859874025541476425832478302972220661277688017673393936226333095n,
          "y": 97933141135755737384413290261786792525004108403409931527059712582886746584404n,
        },
        "role": "admin",
        "sign": [Function],
        "type": "webauthn-p256",
      }
    `)
  })
})

describe('fromWebCryptoP256', () => {
  test('default', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()

    const key = Key.fromWebCryptoP256({
      keyPair: {
        privateKey: keyPair.privateKey,
        publicKey: {
          prefix: 4,
          x: 29425393363637877844360099756708459701670665037779565927194637716883031208592n,
          y: 4454192741171077737571435183656715320148197913661532282490480175757904146724n,
        },
      },
      role: 'admin',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": {
          "prefix": 4,
          "x": 29425393363637877844360099756708459701670665037779565927194637716883031208592n,
          "y": 4454192741171077737571435183656715320148197913661532282490480175757904146724n,
        },
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })
})

describe('serialize', () => {
  test('default', () => {
    const key = Key.fromP256({
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
      role: 'admin',
    })

    expect(Key.serialize(key)).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "isSuperAdmin": true,
        "keyType": 0,
        "publicKey": "0x04ec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
      }
    `)
  })
})
