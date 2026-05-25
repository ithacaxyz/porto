import { describe, expect, test, vi } from 'vitest'
import * as WalletActions from './WalletActions.js'

describe('getAppPrf', () => {
  test('behavior: sends wallet_getAppPrf request and decodes scoped response', async () => {
    const response = {
      account: '0x0000000000000000000000000000000000000001',
      credentialId: 'AQIDBA',
      output: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      prfSupported: true,
      rpId: 'account.example',
    }
    const request = vi.fn(async () => response)
    const client = { request } as never

    const result = await WalletActions.getAppPrf(client, {
      purpose: 'ergon-vault-unlock',
      salt: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      vaultId: 'vault-1',
    })

    expect(request).toHaveBeenCalledWith({
      method: 'wallet_getAppPrf',
      params: [
        {
          purpose: 'ergon-vault-unlock',
          salt: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          vaultId: 'vault-1',
        },
      ],
    })
    expect(result).toEqual(response)
  })
})
