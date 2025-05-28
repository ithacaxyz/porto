import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { Connect } from './components/Connect'
import * as WagmiConfig from './wagmi.config'

const queryClient = new QueryClient()

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={WagmiConfig.config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export function TopNavEnd() {
  return (
    <div className="max-[1080px]:hidden">
      <Connect variant="topnav" />
    </div>
  )
}
