import React from 'react'
import { useConnect, useAccount, useDisconnect, useBalance } from 'wagmi'

export function WalletConnectV2() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  const walletConnectConnector = connectors.find(
    (connector) => connector.id === 'walletConnectV2'
  )

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2>WalletConnect v2 Demo</h2>
      
      {isConnected ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ color: '#0369a1', marginTop: 0 }}>✅ Connected!</h3>
          <p><strong>Address:</strong> <code>{address}</code></p>
          <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
          <p><strong>Chain:</strong> {balance?.chain?.name}</p>
          
          <button 
            onClick={() => disconnect()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '14px'
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ color: '#92400e', marginTop: 0 }}>Connect Mobile Wallet</h3>
          <p>Scan the QR code with your mobile wallet to connect:</p>
          
          {walletConnectConnector ? (
            <button
              onClick={() => connect({ connector: walletConnectConnector })}
              disabled={isPending}
              style={{
                padding: '15px 30px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isPending ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                opacity: isPending ? 0.6 : 1,
                width: '100%',
                marginTop: '10px'
              }}
            >
              {isPending ? 'Connecting...' : 'Connect with WalletConnect v2'}
            </button>
          ) : (
            <p style={{ color: '#ef4444' }}>
              WalletConnect v2 connector not found. Make sure it's configured in your wagmi config.
            </p>
          )}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ marginTop: 0 }}>🚀 Features</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>✅ 300+ Mobile Wallet Support</li>
          <li>✅ QR Code Modal</li>
          <li>✅ Multi-chain Support</li>
          <li>✅ Session Management</li>
          <li>✅ Customizable UI</li>
          <li>✅ Account Balance Display</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#ecfdf5', 
        borderRadius: '8px', 
        border: '1px solid #10b981' 
      }}>
        <h4 style={{ marginTop: 0, color: '#047857' }}>📱 Supported Mobile Wallets</h4>
        <p style={{ margin: '5px 0' }}>
          MetaMask Mobile, Trust Wallet, Rainbow, Coinbase Wallet, SafePal, TokenPocket, 
          Bitget Wallet, OKX Wallet, and 300+ other wallets!
        </p>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fef2f2', 
        borderRadius: '8px', 
        border: '1px solid #f87171' 
      }}>
        <h4 style={{ marginTop: 0, color: '#dc2626' }}>⚠️ Setup Required</h4>
        <p style={{ margin: '5px 0' }}>
          You need a WalletConnect Project ID to use this connector. 
          Get one from <a href="https://cloud.walletconnect.com/" target="_blank" rel="noopener noreferrer">WalletConnect Cloud</a>.
        </p>
      </div>
    </div>
  )
}
