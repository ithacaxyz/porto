# Porto + WalletConnect v2 Example

This example demonstrates how to integrate Porto with WalletConnect v2 for mobile wallet support.

## Features

- ✅ WalletConnect v2 Integration
- ✅ QR Code Modal for mobile wallet connection
- ✅ Support for 300+ mobile wallets
- ✅ Multi-chain support
- ✅ Account balance display
- ✅ Chain information

## Setup

1. **Get WalletConnect Project ID**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID

2. **Update Configuration**
   ```typescript
   // src/config.ts
   export const config = createConfig({
     connectors: [
       walletConnectV2({
         projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your Project ID
         // ... other options
       }),
     ],
   })
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Run Development Server**
   ```bash
   pnpm dev
   ```

5. **Open in Browser**
   - Navigate to `https://localhost:5178`
   - Click "Connect with WalletConnect v2"
   - Scan QR code with your mobile wallet

## Supported Wallets

WalletConnect v2 supports 300+ wallets including:

- MetaMask Mobile
- Trust Wallet
- Rainbow
- Coinbase Wallet
- SafePal
- TokenPocket
- And many more!

## Usage

```typescript
import { walletConnectV2 } from 'porto/wallets/walletconnect-v2'
import { createConfig } from 'wagmi'

export const config = createConfig({
  connectors: [
    walletConnectV2({
      projectId: 'your-project-id',
      metadata: {
        name: 'Your App',
        description: 'Your app description',
        url: 'https://your-app.com',
        icons: ['https://your-app.com/icon.png'],
      },
    }),
  ],
})
```

## Configuration Options

- `projectId`: Your WalletConnect Cloud project ID (required)
- `metadata`: App metadata for wallet display
- `qrModalOptions`: QR code modal customization
- `relayUrl`: Custom relay URL
- `rpcMap`: Custom RPC URLs for different chains

## Troubleshooting

1. **QR Code not showing**: Make sure you have a valid Project ID
2. **Connection fails**: Check your network connection and Project ID
3. **Mobile wallet not found**: Ensure your wallet supports WalletConnect v2

## Learn More

- [WalletConnect v2 Documentation](https://docs.walletconnect.com/2.0/)
- [Porto Documentation](https://porto.xyz)
- [Wagmi Documentation](https://wagmi.sh)
