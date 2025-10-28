import React from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

function App() {
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Porto + WalletConnect v2 Example</h1>
      
      {isConnected ? (
        <div>
          <h2>Connected!</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
          <p><strong>Chain:</strong> {balance?.chain?.name}</p>
          
          <button 
            onClick={() => disconnect()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <h2>Connect Wallet</h2>
          <p>Click the button below to connect using WalletConnect v2:</p>
          
          {walletConnectConnector && (
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
                opacity: isPending ? 0.6 : 1
              }}
            >
              {isPending ? 'Connecting...' : 'Connect with WalletConnect v2'}
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Features:</h3>
        <ul>
          <li>✅ WalletConnect v2 Integration</li>
          <li>✅ QR Code Modal</li>
          <li>✅ Mobile Wallet Support</li>
          <li>✅ Multi-chain Support</li>
          <li>✅ Account Balance Display</li>
          <li>✅ Chain Information</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h4>📱 Supported Mobile Wallets:</h4>
        <p>MetaMask Mobile, Trust Wallet, Rainbow, Coinbase Wallet, and 300+ other wallets!</p>
      </div>
    </div>
  )
}

export default App
