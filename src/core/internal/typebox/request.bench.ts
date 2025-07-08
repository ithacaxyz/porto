import { describe, bench } from 'vitest'
import { parseRequest } from './request.js'

describe('Request', () => {
  bench('parseRequest', () => {
    parseRequest({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
            grantPermissions: {
              expiry: 9999999999,
              key: {
                publicKey:
                  '0x0000000000000000000000000000000000000000000000000000000000000000',
                type: 'p256',
              },
              permissions: {
                calls: [{ to: '0x0000000000000000000000000000000000000000' }],
                spend: [
                  {
                    limit: '0x0',
                    period: 'day',
                    token: '0x0000000000000000000000000000000000000000',
                  },
                ],
              },
            },
          },
        },
      ],
    })
  })
})
