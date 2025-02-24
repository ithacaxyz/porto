import * as Hex from 'ox/Hex'
import { describe, expect, test } from 'vitest'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Key from '../key.js'
import * as ActionRequest from './actionRequest.js'

describe('prepare', () => {
  test('default', () => {
    const request = ActionRequest.prepare({
      account: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
      calls: [
        {
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
          data: '0xdeadbeef',
        },
        {
          to: '0xcafebabecafebabecafebabecafebabecafebabe',
          value: 1000n,
        },
        {
          to: Call.self,
          data: '0xcafebabe',
        },
      ],
    })

    expect(request.executionData).toMatchInlineSnapshot(
      `"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000deadbeefdeadbeefdeadbeefdeadbeefdeadbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004deadbeef00000000000000000000000000000000000000000000000000000000000000000000000000000000cafebabecafebabecafebabecafebabecafebabe00000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000beefbeefbeefbeefbeefbeefbeefbeefbeefbeef000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004cafebabe00000000000000000000000000000000000000000000000000000000"`,
    )
    expect(Hex.slice(Hex.fromNumber(request.nonce, { size: 32 }), 0, 2)).toBe(
      '0x0000',
    )
  })

  test('behavior: multichain', () => {
    const request = ActionRequest.prepare({
      account: '0x0000000000000000000000000000000000000000',
      calls: [
        Call.authorize({
          key: Key.createP256({
            role: 'admin',
          }),
        }),
      ],
      multichain: true,
    })

    expect(Hex.slice(Hex.fromNumber(request.nonce, { size: 32 }), 0, 2)).toBe(
      '0xc1d0',
    )
  })

  test('behavior: account', () => {
    const account = Account.from('0x0000000000000000000000000000000000000000')
    const request = ActionRequest.prepare({
      account,
      calls: [
        {
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
          data: '0xdeadbeef',
        },
        {
          to: '0xcafebabecafebabecafebabecafebabecafebabe',
          value: 1000n,
        },
      ],
    })

    expect(request.eoa).toMatchInlineSnapshot(
      `"0x0000000000000000000000000000000000000000"`,
    )
  })
})
