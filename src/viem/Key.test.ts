import {
  Bytes,
  Hex,
  PublicKey,
  Secp256k1,
  Value,
  WebAuthnP256,
  WebCryptoP256,
} from 'ox'
import { verifyHash } from 'viem/actions'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { createAccount } from '../../test/src/actions.js'
import * as TestConfig from '../../test/src/config.js'
import type * as Tokens from '../core/internal/tokens.js'
import * as Key from './Key.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)

const feeTokens = [
  {
    address: '0x97870b32890d3f1f089489a29007863a5678089d',
    decimals: 6,
    feeToken: true,
    interop: true,
    nativeRate: 387750000000000n,
    symbol: 'EXP',
    uid: 'exp',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    feeToken: true,
    interop: true,
    nativeRate: 10n ** 18n,
    symbol: 'ETH',
    uid: 'ethereum',
  },
] as const satisfies Tokens.Tokens

describe('createP256', () => {
  test('default', () => {
    const key = Key.createP256()

    const { hash, id, publicKey, ...rest } = key

    expect(hash).toBeDefined()
    expect(id).toBeDefined()
    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "permissions": undefined,
        "prehash": false,
        "privateKey": [Function],
        "role": "admin",
        "type": "p256",
      }
    `)
  })
})

describe('createSecp256k1', () => {
  test('default', () => {
    const key = Key.createSecp256k1()

    const { hash, id, publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(hash).toBeDefined()
    expect(id).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "permissions": undefined,
        "prehash": false,
        "privateKey": [Function],
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: authorize + sign', async () => {
    const key = Key.createSecp256k1()
    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const payload = Hex.random(32)
    const signature = await Key.sign(key, {
      address: account.address,
      payload,
    })

    expect(
      await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      }),
    ).toBe(true)
  })
})

describe('createWebAuthnP256', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {
      document: {
        title: 'My Website',
      },
      location: {
        hostname: 'https://example.com',
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
      userId: Bytes.from('0x0000000000000000000000000000000000000000'),
    })

    const { hash, id, publicKey, ...rest } = key

    expect(publicKey).toBeDefined()
    expect(hash).toBeDefined()
    expect(id).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "permissions": undefined,
        "prehash": false,
        "privateKey": {
          "credential": {
            "id": "m1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs",
            "publicKey": {
              "prefix": 4,
              "x": 77587693192652859874025541476425832478302972220661277688017673393936226333095n,
              "y": 97933141135755737384413290261786792525004108403409931527059712582886746584404n,
            },
          },
          "rpId": undefined,
        },
        "role": "admin",
        "type": "webauthn-p256",
      }
    `)
  })

  test('behavior: authorize + sign', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await createAccount(client, {
      deploy: true,
      keys: [key],
    })

    const payload = Hex.random(32)
    const signature = await Key.sign(key, {
      address: account.address,
      payload,
    })

    expect(
      await verifyHash(client, {
        address: account.address,
        hash: payload,
        signature,
      }),
    ).toBe(true)
  })
})

describe('createWebCryptoP256', () => {
  test('default', async () => {
    const key = await Key.createWebCryptoP256()

    const { hash, id, publicKey, ...rest } = key

    expect(hash).toBeDefined()
    expect(id).toBeDefined()
    expect(publicKey).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "permissions": undefined,
        "prehash": true,
        "privateKey": CryptoKey {},
        "role": "admin",
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
    })
    const serialized = Key.serialize(key)
    const deserialized = Key.deserialize(serialized)

    expect(deserialized).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0xed7ac7c7b35b77e97be67b84f5889e0ab3ecc69ab65d57db191e11f8811e9965",
        "id": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "prehash": false,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })

  test('secp256k1', () => {
    const key = Key.fromSecp256k1({
      publicKey:
        '0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008',
    })
    const serialized = Key.serialize(key)
    const deserialized = Key.deserialize(serialized)

    expect(deserialized).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0x6364f61156f50881a6e5b27442a97c2f218cba981f5bcd1a398750515212b1ab",
        "id": "0xe9cf8e14602e9f081668f2839e63ceb23c6e0e5a",
        "prehash": false,
        "publicKey": "0xe9cf8e14602e9f081668f2839e63ceb23c6e0e5a",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('address', () => {
    const key = Key.fromSecp256k1({
      address: '0xed7ac7c7b35b77e97be67b84f5889e0ab3412222',
    })
    const serialized = Key.serialize(key)
    const deserialized = Key.deserialize(serialized)

    expect(deserialized).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0xf3d20b7404e4008e6a4df9ffbce26e5f275296eda26b4e82e6c6ea05ad85b650",
        "id": "0xed7ac7c7b35b77e97be67b84f5889e0ab3412222",
        "prehash": false,
        "publicKey": "0xed7ac7c7b35b77e97be67b84f5889e0ab3412222",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })
})

describe('from', () => {
  test('default', () => {
    const publicKey = PublicKey.toHex(
      Secp256k1.getPublicKey({
        privateKey:
          '0x72685afe259e683fa3b7819c4745383ba36366c7571fd17456fd4cd9777aedcb',
      }),
      {
        includePrefix: false,
      },
    )

    const key = Key.from({
      expiry: 69420,
      privateKey() {
        return '0x'
      },
      publicKey,

      type: 'p256',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 69420,
        "hash": "0x8708c3265105bf57dd6be9e79d384bde46f64e9cf75ddeb72bca10de17986b33",
        "id": "0x144f4bf8bda60e5bf0e9f11a509e55a14987a6c5a63aed81bcb6939f9f5abc7c3598cce19015350ce8d30f11e57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "prehash": false,
        "privateKey": [Function],
        "publicKey": "0x144f4bf8bda60e5bf0e9f11a509e55a14987a6c5a63aed81bcb6939f9f5abc7c3598cce19015350ce8d30f11e57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "role": "admin",
        "type": "p256",
      }
    `)
  })

  test('behavior: secp256k1', () => {
    expect(
      Key.from({
        publicKey: '0xe57cbdd55ccfbc5f30d9ccf59ffd080967229fe9',
        type: 'secp256k1',
      }),
    ).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0x8f76ad68e08f96d89aecd0d57e451be5152675b77ae73134389656e0bc3d695a",
        "id": "0xe57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "prehash": false,
        "publicKey": "0xe57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "role": "admin",
        "type": "secp256k1",
      }
    `)

    expect(
      Key.from({
        publicKey:
          '0x000000000000000000000000e57cbdd55ccfbc5f30d9ccf59ffd080967229fe9',
        type: 'secp256k1',
      }),
    ).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0x8f76ad68e08f96d89aecd0d57e451be5152675b77ae73134389656e0bc3d695a",
        "id": "0xe57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "prehash": false,
        "publicKey": "0xe57cbdd55ccfbc5f30d9ccf59ffd080967229fe9",
        "role": "admin",
        "type": "secp256k1",
      }
    `)

    expect(
      Key.from({
        publicKey:
          '0x144f4bf8bda60e5bf0e9f11a509e55a14987a6c5a63aed81bcb6939f9f5abc7c3598cce19015350ce8d30f11e57cbdd55ccfbc5f30d9ccf59ffd080967229fe9',
        type: 'secp256k1',
      }),
    ).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "hash": "0xc17311fbf840057e649cef2df2acac84d1fc35a37d754f5f1aa5c00f0d887b21",
        "id": "0x03febc0a78f3e15613be7be0bd84abcd1652d3f0",
        "prehash": false,
        "publicKey": "0x03febc0a78f3e15613be7be0bd84abcd1652d3f0",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: serialized', () => {
    const publicKey = PublicKey.toHex(
      Secp256k1.getPublicKey({
        privateKey: Secp256k1.randomPrivateKey(),
      }),
      {
        includePrefix: false,
      },
    )

    const key = Key.from({
      expiry: 69420,
      privateKey() {
        return '0x'
      },
      publicKey,
      type: 'p256',
    })
    const serialized = Key.serialize(key)

    expect({
      ...Key.deserialize(serialized),
      hash: undefined,
      id: undefined,
      prehash: undefined,
    }).toEqual({
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
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0xed7ac7c7b35b77e97be67b84f5889e0ab3ecc69ab65d57db191e11f8811e9965",
        "id": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "permissions": undefined,
        "prehash": false,
        "privateKey": [Function],
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })

  test('args: expiry', () => {
    const key = Key.fromP256({
      expiry: 69420,
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 69420,
        "feeToken": undefined,
        "hash": "0xed7ac7c7b35b77e97be67b84f5889e0ab3ecc69ab65d57db191e11f8811e9965",
        "id": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "permissions": undefined,
        "prehash": false,
        "privateKey": [Function],
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })
})

describe('fromRelay', () => {
  test('default', () => {
    const key = Key.fromRelay(
      {
        expiry: 0,
        permissions: [
          {
            selector: '0x1249c58b',
            to: '0x3232323232323232323232323232323232323232',
            type: 'call',
          },
          {
            selector: '0xdeadbeef',
            to: '0x0000000000000000000000000000000000000000',
            type: 'call',
          },
          {
            limit: 1000000000000000000n,
            period: 'minute',
            token: '0x0000000000000000000000000000000000000000',
            type: 'spend',
          },
        ],
        publicKey:
          '0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008',
        role: 'admin',
        type: 'p256',
      },
      {
        chainId: 1,
      },
    )

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "expiry": 0,
        "hash": "0xed7ac7c7b35b77e97be67b84f5889e0ab3ecc69ab65d57db191e11f8811e9965",
        "id": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "permissions": {
          "calls": [
            {
              "signature": "0x1249c58b",
              "to": undefined,
            },
            {
              "signature": "0xdeadbeef",
              "to": "0x0000000000000000000000000000000000000000",
            },
          ],
          "spend": [
            {
              "limit": 1000000000000000000n,
              "period": "minute",
              "token": "0x0000000000000000000000000000000000000000",
            },
          ],
        },
        "prehash": false,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })
})

describe('fromSecp256k1', () => {
  test('args: privateKey', () => {
    const key = Key.fromSecp256k1({
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0xd325ebfdb383f9fca8e4e1c443cdceddda39f1f860824156b75ec85f11b94a35",
        "id": "0x673ee8aabd3a62434cb9e3d7c6f9492e286bcb08",
        "permissions": undefined,
        "prehash": false,
        "privateKey": [Function],
        "publicKey": "0x673ee8aabd3a62434cb9e3d7c6f9492e286bcb08",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('args: address', () => {
    const key = Key.fromSecp256k1({
      address: '0x0000000000000000000000000000000000000000',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0x6ce15638cb31daec095a6f3834f344957f69c7dc09ff935917447b3d65976595",
        "id": "0x0000000000000000000000000000000000000000",
        "permissions": undefined,
        "prehash": false,
        "privateKey": undefined,
        "publicKey": "0x0000000000000000000000000000000000000000",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })

  test('args: publicKey', () => {
    const key = Key.fromSecp256k1({
      publicKey:
        '0x626c7f1042b6d3971be0e4c054165e36a6d6a5ace6af1773654d3360fccf0b25b0c998938d9b73e749023eb1c77f5930b5a87660deec42261a9a22fac9a56536',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0xd325ebfdb383f9fca8e4e1c443cdceddda39f1f860824156b75ec85f11b94a35",
        "id": "0x673ee8aabd3a62434cb9e3d7c6f9492e286bcb08",
        "permissions": undefined,
        "prehash": false,
        "privateKey": undefined,
        "publicKey": "0x673ee8aabd3a62434cb9e3d7c6f9492e286bcb08",
        "role": "admin",
        "type": "secp256k1",
      }
    `)
  })
})

describe('fromWebAuthnP256', () => {
  beforeAll(() => {
    vi.stubGlobal('window', {
      document: {
        title: 'My Website',
      },
      location: {
        hostname: 'https://example.com',
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
      id: '0x0000000000000000000000000000000000000000',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0x2a7a39929a819ed8472f7fe3aa65a758432cc8ab833e9999f50217d55c70c50f",
        "id": "0x0000000000000000000000000000000000000000",
        "permissions": undefined,
        "prehash": false,
        "privateKey": {
          "credential": {
            "id": "m1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs",
            "publicKey": {
              "prefix": 4,
              "x": 77587693192652859874025541476425832478302972220661277688017673393936226333095n,
              "y": 97933141135755737384413290261786792525004108403409931527059712582886746584404n,
            },
            "raw": {
              "id": "m1-bMPuAqpWhCxHZQZTT6e-lSPntQbh3opIoGe7g4Qs",
              "response": {
                "getPublicKey": [Function],
              },
            },
          },
          "rpId": undefined,
        },
        "publicKey": "0xab891400140fc4f8e941ce0ff90e419de9470acaca613bbd717a4775435031a7d884318e919fd3b3e5a631d866d8a380b44063e70f0c381ee16e0652f7f97554",
        "role": "admin",
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
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "chainId": undefined,
        "expiry": 0,
        "feeToken": undefined,
        "hash": "0xa2085f4d3a69fcf0182dbe60a3b7da9b5fd8b2b54d7ea39d345ba82d6edc8fe1",
        "id": "0x410e2eb4820de45c0dd6730c300c3c66b8bc5885c963067fe0ff29c5e480329009d8fbd71e76257a2d5577e2211a62114eca15c9218d488209fa789a45497124",
        "permissions": undefined,
        "prehash": true,
        "privateKey": CryptoKey {},
        "publicKey": "0x410e2eb4820de45c0dd6730c300c3c66b8bc5885c963067fe0ff29c5e480329009d8fbd71e76257a2d5577e2211a62114eca15c9218d488209fa789a45497124",
        "role": "admin",
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
    })

    expect(Key.serialize(key)).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "isSuperAdmin": true,
        "keyType": 0,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
      }
    `)
  })
})

describe('toRelay', () => {
  test('default', () => {
    const key = Key.fromP256({
      permissions: {
        calls: [
          {
            signature: 'mint()',
          },
          {
            signature: '0xdeadbeef',
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
        spend: [
          {
            limit: 1000000000000000000n,
            period: 'minute',
            token: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    })

    expect(Key.toRelay(key)).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "permissions": [
          {
            "selector": "0x1249c58b",
            "to": "0x3232323232323232323232323232323232323232",
            "type": "call",
          },
          {
            "selector": "0xdeadbeef",
            "to": "0x0000000000000000000000000000000000000000",
            "type": "call",
          },
          {
            "limit": 1000000000000000000n,
            "period": "minute",
            "token": "0x0000000000000000000000000000000000000000",
            "type": "spend",
          },
        ],
        "prehash": false,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })

  test('behavior: feeToken', () => {
    const key = Key.fromP256({
      feeToken: {
        limit: '1',
        symbol: 'EXP',
      },
      permissions: {
        calls: [
          {
            signature: 'mint()',
          },
          {
            signature: '0xdeadbeef',
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
        spend: [
          {
            limit: 1000000000000000000n,
            period: 'minute',
            token: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    })

    expect(Key.toRelay(key, { feeTokens })).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "permissions": [
          {
            "selector": "0x1249c58b",
            "to": "0x3232323232323232323232323232323232323232",
            "type": "call",
          },
          {
            "selector": "0xdeadbeef",
            "to": "0x0000000000000000000000000000000000000000",
            "type": "call",
          },
          {
            "limit": 1000000n,
            "period": "minute",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
            "type": "spend",
          },
          {
            "limit": 1000000000000000000n,
            "period": "minute",
            "token": "0x0000000000000000000000000000000000000000",
            "type": "spend",
          },
        ],
        "prehash": false,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })

  test('behavior: feeToken (existing spend permission)', () => {
    const key = Key.fromP256({
      feeToken: {
        limit: '1',
        symbol: 'ETH',
      },
      permissions: {
        calls: [
          {
            signature: 'mint()',
          },
          {
            signature: '0xdeadbeef',
            to: '0x0000000000000000000000000000000000000000',
          },
        ],
        spend: [
          {
            limit: 1000000000000000000n,
            period: 'minute',
            token: '0x0000000000000000000000000000000000000001',
          },
          {
            limit: 1000000000000000000n,
            period: 'minute',
            token: '0x0000000000000000000000000000000000000000',
          },
        ],
      },
      privateKey:
        '0x59ff6b8de3b3b39e94b6f9fc0590cf4e3eaa9b6736e6a49c9a6b324c4f58cb9f',
    })

    expect(Key.toRelay(key, { feeTokens })).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "permissions": [
          {
            "selector": "0x1249c58b",
            "to": "0x3232323232323232323232323232323232323232",
            "type": "call",
          },
          {
            "selector": "0xdeadbeef",
            "to": "0x0000000000000000000000000000000000000000",
            "type": "call",
          },
          {
            "limit": 2000000000000000000n,
            "period": "minute",
            "token": "0x0000000000000000000000000000000000000000",
            "type": "spend",
          },
          {
            "limit": 1000000000000000000n,
            "period": "minute",
            "token": "0x0000000000000000000000000000000000000001",
            "type": "spend",
          },
        ],
        "prehash": false,
        "publicKey": "0xec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008",
        "role": "admin",
        "type": "p256",
      }
    `)
  })
})

describe('resolvePermissions', () => {
  test('default', () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '10',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 25000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no fee tokens provided', async () => {
    const result = Key.resolvePermissions(
      {
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {},
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 15000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: empty fee tokens array', async () => {
    const result = Key.resolvePermissions(
      {
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('15', 6),
              period: 'year',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens: [],
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 15000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no existing spend permissions', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '5',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 5000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: no matching spend permission but has other permissions', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '5',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('10', 18),
              period: 'month',
              token: '0x0000000000000000000000000000000000000000',
            },
            {
              limit: Value.from('20', 18),
              period: 'day',
              token: '0x1111111111111111111111111111111111111111',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 5000000n,
            "period": "day",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
          {
            "limit": 10000000000000000000n,
            "period": "month",
            "token": "0x0000000000000000000000000000000000000000",
          },
          {
            "limit": 20000000000000000000n,
            "period": "day",
            "token": "0x1111111111111111111111111111111111111111",
          },
        ],
      }
    `)
  })

  test('behavior: updates existing spend permission with matching fee token', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '3',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('5', 18),
              period: 'day',
              token: '0x0000000000000000000000000000000000000000',
            },
            {
              limit: Value.from('10', 6),
              period: 'month',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 13000000n,
            "period": "month",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
          {
            "limit": 5000000000000000000n,
            "period": "day",
            "token": "0x0000000000000000000000000000000000000000",
          },
        ],
      }
    `)
  })

  test('behavior: handles ETH spend permission (ETH fee token)', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '2',
          symbol: 'ETH',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('10', 18),
              period: 'week',
            },
          ],
        },
      },
      {
        feeTokens: feeTokens.toReversed(),
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 12000000000000000000n,
            "period": "week",
          },
        ],
      }
    `)
  })

  test('behavior: preserves other permission fields', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '1',
          symbol: 'EXP',
        },
        permissions: {
          calls: [
            {
              signature: '0x12345678',
              to: '0x1234567890123456789012345678901234567890',
            },
          ],
          spend: [],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [
          {
            "signature": "0x12345678",
            "to": "0x1234567890123456789012345678901234567890",
          },
        ],
        "spend": [
          {
            "limit": 1000000n,
            "period": "year",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })

  test('behavior: handles zero fee limit', async () => {
    const result = Key.resolvePermissions(
      {
        feeToken: {
          limit: '0',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: Value.from('5', 6),
              period: 'day',
              token: '0x97870b32890d3f1f089489a29007863a5678089d',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "calls": [],
        "spend": [
          {
            "limit": 5000000n,
            "period": "day",
            "token": "0x97870b32890d3f1f089489a29007863a5678089d",
          },
        ],
      }
    `)
  })
})

describe('getFeeToken', () => {
  test('default', () => {
    const feeToken = Key.getFeeToken(
      {
        feeToken: {
          limit: '0.01',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
          spend: [
            {
              limit: 1000000000000000000n,
              period: 'year',
            },
          ],
        },
      },
      {
        feeTokens,
      },
    )

    expect(feeToken).toMatchInlineSnapshot(`
      {
        "address": "0x97870b32890d3f1f089489a29007863a5678089d",
        "decimals": 6,
        "feeToken": true,
        "interop": true,
        "nativeRate": 387750000000000n,
        "symbol": "EXP",
        "uid": "exp",
        "value": 10000n,
      }
    `)
  })

  test('behavior: handles native fee token', () => {
    const result = Key.getFeeToken(
      {
        feeToken: {
          limit: '0.01',
          symbol: 'native',
        },
      },
      {
        feeTokens,
      },
    )
    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0x0000000000000000000000000000000000000000",
        "decimals": 18,
        "feeToken": true,
        "interop": true,
        "nativeRate": 1000000000000000000n,
        "symbol": "ETH",
        "uid": "ethereum",
        "value": 10000000000000000n,
      }
    `)
  })

  test('behavior: returns default when no fee limit', () => {
    const request = {
      permissions: {
        calls: [],
      },
    } as const
    const result = Key.getFeeToken(request, {
      feeTokens,
    })
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: returns zero when null fee limit', () => {
    const request = {
      permissions: {
        calls: [],
        feeToken: null,
      },
    } as const
    const result = Key.getFeeToken(request, {
      feeTokens,
    })
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: returns zero value when limit token not found', () => {
    const tokens = [
      {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        interop: true,
        nativeRate: 10n ** 18n,
        symbol: 'ETH',
        uid: 'ethereum',
      },
    ] as const satisfies Tokens.Tokens

    const result = Key.getFeeToken(
      {
        feeToken: {
          limit: '0.01',
          symbol: 'EXP',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens: tokens,
      },
    )
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('behavior: handles tokens without native rate', () => {
    const tokens = [
      {
        address: '0x97870b32890d3f1f089489a29007863a5678089d',
        decimals: 18,
        interop: true,
        symbol: 'EXP',
        uid: 'exp',
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        interop: true,
        symbol: 'ETH',
        uid: 'ethereum',
      },
    ] as const satisfies Tokens.Tokens

    const result = Key.getFeeToken(
      {
        feeToken: {
          limit: '0.01',
          symbol: 'ETH',
        },
        permissions: {
          calls: [],
        },
      },
      {
        feeTokens: tokens,
      },
    )
    expect(result?.value).toMatchInlineSnapshot('10000000000000000n')
  })
})
