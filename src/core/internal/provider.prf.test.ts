import { describe, expect, test } from 'vitest'
import { Mode, Porto, Storage } from '../../index.js'

describe('provider wallet_getAppPrf', () => {
  test('behavior: headless provider rejects PRF RPC for hosted dialog handling', async () => {
    const porto = Porto.create({
      announceProvider: false,
      mode: Mode.relay({ mock: true }),
      storage: Storage.memory(),
    })

    await expect(
      porto.provider.request({
        method: 'wallet_getAppPrf',
        params: [
          {
            purpose: 'ergon-vault-unlock',
            salt: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            vaultId: 'vault-1',
          },
        ],
      }),
    ).rejects.toMatchObject({
      message: 'wallet_getAppPrf must be handled by the hosted dialog.',
    })

    porto.destroy()
  })
})
