import { describe, it, expect, vi, beforeEach } from 'vitest'
import { walletConnectV2Mode } from '../../src/wallets/walletconnect-v2/Mode'

// Mock WalletConnect
vi.mock('@walletconnect/ethereum-provider', () => ({
  EthereumProvider: {
    init: vi.fn().mockResolvedValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
      accounts: ['0x1234567890123456789012345678901234567890'],
      chainId: 1,
      request: vi.fn(),
      on: vi.fn(),
    }),
  },
}))

describe('WalletConnect v2 Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create mode with required parameters', () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    expect(mode).toBeDefined()
    expect(mode.name).toBe('walletconnect-v2')
  })

  it('should create mode with optional parameters', () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
      metadata: {
        name: 'Test App',
        description: 'Test Description',
        url: 'https://test.com',
        icons: ['https://test.com/icon.png'],
      },
      qrModalOptions: {
        themeMode: 'dark',
      },
    })

    expect(mode).toBeDefined()
  })

  it('should have required actions', () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    expect(mode.actions).toBeDefined()
    expect(mode.actions.createAccount).toBeDefined()
    expect(mode.actions.connect).toBeDefined()
    expect(mode.actions.signMessage).toBeDefined()
    expect(mode.actions.sendTransaction).toBeDefined()
    expect(mode.actions.switchChain).toBeDefined()
    expect(mode.actions.getAccountVersion).toBeDefined()
    expect(mode.actions.getAssets).toBeDefined()
    expect(mode.actions.prepareCalls).toBeDefined()
    expect(mode.actions.sendCalls).toBeDefined()
    expect(mode.actions.signTypedData).toBeDefined()
    expect(mode.actions.upgradeAccount).toBeDefined()
    expect(mode.actions.verifyEmail).toBeDefined()
    expect(mode.actions.addFunds).toBeDefined()
  })

  it('should have setup function', () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    expect(mode.setup).toBeDefined()
    expect(typeof mode.setup).toBe('function')
  })

  it('should handle setup with internal config', () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      config: {
        chains: [{ id: 1, name: 'Ethereum' }],
      },
    }

    const cleanup = mode.setup(mockInternal as any)
    expect(typeof cleanup).toBe('function')
  })

  it('should handle createAccount action', async () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      client: { chain: { id: 1 } },
      config: { chains: [{ id: 1 }] },
    }

    const result = await mode.actions.createAccount({
      internal: mockInternal as any,
    })

    expect(result).toBeDefined()
    expect(result.account).toBeDefined()
  })

  it('should handle connect action', async () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      client: { chain: { id: 1 } },
      config: { chains: [{ id: 1 }] },
    }

    const result = await mode.actions.connect({
      internal: mockInternal as any,
    })

    expect(result).toBeDefined()
    expect(result.accounts).toBeDefined()
  })

  it('should handle signMessage action', async () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      client: { chain: { id: 1 } },
    }

    const result = await mode.actions.signMessage({
      internal: mockInternal as any,
      message: '0x1234',
    })

    expect(result).toBeDefined()
  })

  it('should handle sendTransaction action', async () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      client: { chain: { id: 1 } },
    }

    const result = await mode.actions.sendTransaction({
      internal: mockInternal as any,
      transaction: { to: '0x123', value: '0x0' },
    })

    expect(result).toBeDefined()
  })

  it('should handle switchChain action', async () => {
    const mode = walletConnectV2Mode({
      projectId: 'test-project-id',
    })

    const mockInternal = {
      client: { chain: { id: 1 } },
    }

    await mode.actions.switchChain({
      internal: mockInternal as any,
      chainId: 1,
    })

    // Should not throw
    expect(true).toBe(true)
  })
})
