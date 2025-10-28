import { describe, it, expect, vi, beforeEach } from 'vitest'
import { walletConnectV2 } from '../../src/wallets/walletconnect-v2/Connector'

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

describe('WalletConnect v2 Connector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create connector with required parameters', () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    expect(connector).toBeDefined()
    expect(connector.id).toBe('walletConnectV2')
    expect(connector.name).toBe('WalletConnect v2')
  })

  it('should create connector with optional parameters', () => {
    const connector = walletConnectV2({
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

    expect(connector).toBeDefined()
  })

  it('should handle connect method', async () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    const wagmiConfig = {
      chains: [{ id: 1, name: 'Ethereum' }],
    }

    const connectorInstance = connector(wagmiConfig as any)
    
    expect(connectorInstance.connect).toBeDefined()
    expect(typeof connectorInstance.connect).toBe('function')
  })

  it('should handle disconnect method', async () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    const wagmiConfig = {
      chains: [{ id: 1, name: 'Ethereum' }],
    }

    const connectorInstance = connector(wagmiConfig as any)
    
    expect(connectorInstance.disconnect).toBeDefined()
    expect(typeof connectorInstance.disconnect).toBe('function')
  })

  it('should handle getAccounts method', async () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    const wagmiConfig = {
      chains: [{ id: 1, name: 'Ethereum' }],
    }

    const connectorInstance = connector(wagmiConfig as any)
    
    expect(connectorInstance.getAccounts).toBeDefined()
    expect(typeof connectorInstance.getAccounts).toBe('function')
  })

  it('should handle getChainId method', async () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    const wagmiConfig = {
      chains: [{ id: 1, name: 'Ethereum' }],
    }

    const connectorInstance = connector(wagmiConfig as any)
    
    expect(connectorInstance.getChainId).toBeDefined()
    expect(typeof connectorInstance.getChainId).toBe('function')
  })

  it('should handle switchChain method', async () => {
    const connector = walletConnectV2({
      projectId: 'test-project-id',
    })

    const wagmiConfig = {
      chains: [{ id: 1, name: 'Ethereum' }],
    }

    const connectorInstance = connector(wagmiConfig as any)
    
    expect(connectorInstance.switchChain).toBeDefined()
    expect(typeof connectorInstance.switchChain).toBe('function')
  })
})
