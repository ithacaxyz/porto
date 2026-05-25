import { describe, expect, test } from 'vitest'
import { methodPolicies } from './methodPolicies.js'

describe('methodPolicies', () => {
  test('behavior: wallet_getAppPrf is dialog-only', () => {
    const policy = methodPolicies.find(
      (policy) => policy.method === 'wallet_getAppPrf',
    )

    expect(policy).toEqual({
      method: 'wallet_getAppPrf',
      modes: {
        dialog: true,
      },
    })
  })
})
