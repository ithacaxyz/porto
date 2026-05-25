import { describe, expect, test, vi } from 'vitest'
import { relay } from './relay.js'

vi.mock('../../../viem/RelayActions.js', () => ({
  getCapabilities: vi.fn(async () => ({
    '1': {
      fees: {
        tokens: [],
      },
    },
  })),
}))

describe('relay PRF capabilities', () => {
  test('behavior: reports unsupported when PRF is not configured', async () => {
    const mode = relay({ mock: true })

    const capabilities = await mode.actions.getCapabilities({
      internal: internal(),
    } as never)

    expect(Object.values(capabilities)[0]?.prf).toEqual({
      status: 'unsupported',
    })
  })

  test('behavior: reports configured PRF credential-not-enabled default', async () => {
    const mode = relay({ mock: true, webAuthn: { prf: true } })

    const capabilities = await mode.actions.getCapabilities({
      internal: internal(),
    } as never)

    expect(Object.values(capabilities)[0]?.prf).toEqual({
      status: 'credential-not-enabled',
    })
  })

  test('behavior: reports current credential PRF status from hosted dialog callback', async () => {
    const prfStatus = vi.fn(async () => 'enabled' as const)
    const mode = relay({
      mock: true,
      webAuthn: {
        prf: true,
        prfStatus,
      },
    })

    const capabilities = await mode.actions.getCapabilities({
      internal: internal(),
    } as never)

    expect(prfStatus).toHaveBeenCalledWith({
      account: '0x0000000000000000000000000000000000000001',
    })
    expect(Object.values(capabilities)[0]?.prf).toEqual({ status: 'enabled' })
  })
})

function internal() {
  return {
    client: {
      chain: {
        id: 1,
      },
    },
    store: {
      getState() {
        return {
          accounts: [
            {
              address: '0x0000000000000000000000000000000000000001',
            },
          ],
        }
      },
    },
  }
}
