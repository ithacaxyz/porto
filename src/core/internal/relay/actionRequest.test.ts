import { describe, expect, test } from 'vitest'

import * as Account from '../account.js'
import * as Call from '../call.js'
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
    expect(request.nonce & 1n).toBe(0n)
  })

  test('behavior: multichain', () => {
    const request = ActionRequest.prepare({
      account: '0x0000000000000000000000000000000000000000',
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
      multichain: true,
    })

    expect(request.nonce & 1n).toBe(1n)
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
      multichain: true,
    })

    expect(request.eoa).toMatchInlineSnapshot(
      `"0x0000000000000000000000000000000000000000"`,
    )
  })

  test('behavior: nonce', () => {
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
      nonce: 6n,
    })

    expect(request.nonce).toBe(6n)
  })

  test('behavior: odd nonce, single chain', () => {
    const account = Account.from('0x0000000000000000000000000000000000000000')
    expect(() =>
      ActionRequest.prepare({
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
        nonce: 5n,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: single chain nonce must be even]',
    )
  })

  test('behavior: even nonce, multichain', () => {
    const account = Account.from('0x0000000000000000000000000000000000000000')
    expect(() =>
      ActionRequest.prepare({
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
        nonce: 6n,
        multichain: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: multichain nonce must be odd]',
    )
  })
})
