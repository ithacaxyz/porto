import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import Head from 'next/head'

import { Connect } from './components/Connect'
import * as WagmiConfig from './wagmi.config'

const queryClient = new QueryClient()

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <WagmiProvider config={WagmiConfig.config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </>
  )
}

export function TopNavEnd() {
  return (
    <div className="max-[1080px]:hidden">
      <Connect variant="topnav" />
    </div>
  )
}
