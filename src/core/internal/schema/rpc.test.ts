import { describe, expect, test } from 'vitest'
import * as z from 'zod/mini'
import * as Rpc from './rpc.js'

describe('wallet_getAppPrf', () => {
  test('behavior: validates base64url 32-byte salt parameter shape', () => {
    const request = z.parse(Rpc.wallet_getAppPrf.Request, {
      method: 'wallet_getAppPrf',
      params: [
        {
          purpose: 'ergon-vault-unlock',
          salt: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          vaultId: 'vault-1',
        },
      ],
    })

    expect(request.params[0]).toEqual({
      purpose: 'ergon-vault-unlock',
      salt: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      vaultId: 'vault-1',
    })
  })

  test('behavior: rejects non-32-byte salt encoding shape', () => {
    expect(() =>
      z.parse(Rpc.wallet_getAppPrf.Request, {
        method: 'wallet_getAppPrf',
        params: [
          {
            purpose: 'ergon-vault-unlock',
            salt: 'short',
            vaultId: 'vault-1',
          },
        ],
      }),
    ).toThrow()
  })
})
