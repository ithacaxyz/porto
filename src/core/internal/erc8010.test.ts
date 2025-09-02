import { Hex } from 'ox'
import { SignatureErc8010 } from 'ox/erc8010'
import { verifyHash } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import * as TestActions from '../../../test/src/actions.js'
import * as TestConfig from '../../../test/src/config.js'
import * as Account from '../../viem/Account.js'
import * as Key from '../../viem/Key.js'
import * as Erc8010 from './erc8010.js'

const porto = TestConfig.getPorto()
const client = TestConfig.getRelayClient(porto)

describe('wrap', () => {
  test('default', async () => {
    const key = Key.createHeadlessWebAuthnP256()
    const account = await TestActions.createAccount(client, {
      keys: [key],
    })

    const digest = Hex.random(32)

    const signature = await Account.sign(account, {
      payload: digest,
    })

    const wrapped = await Erc8010.wrap(client, {
      address: account.address,
      signature,
    })
    expect(SignatureErc8010.validate(wrapped)).toBe(true)
  })
})

describe('e2e', async () => {
  test.each([
    {
      delegated: false,
      key: Key.createHeadlessWebAuthnP256(),
      type: 'webauthn-p256',
    },
    {
      delegated: true,
      key: Key.createHeadlessWebAuthnP256(),
      type: 'webauthn-p256',
    },
    { delegated: false, key: Key.createSecp256k1(), type: 'secp256k1' },
    { delegated: true, key: Key.createSecp256k1(), type: 'secp256k1' },
  ])('type: $type, delegated: $delegated', async ({ key, delegated }) => {
    const account = await TestActions.createAccount(client, {
      deploy: delegated,
      keys: [key],
    })

    const digest = Hex.random(32)

    const signature = await Account.sign(account, {
      payload: digest,
    })

    const wrapped = await Erc8010.wrap(client, {
      address: account.address,
      signature,
    })
    expect(SignatureErc8010.validate(wrapped)).toBe(true)

    const valid = await verifyHash(client, {
      address: account.address,
      hash: digest,
      signature: wrapped,
    })
    expect(valid).toBe(true)
  })
})
