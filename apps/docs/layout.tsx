import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'

import { Connect } from './components/Connect'
import * as WagmiConfig from './wagmi.config'

const queryClient = new QueryClient()

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiProvider config={WagmiConfig.config}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </QueryClientProvider>
      </WagmiProvider>

      <Toaster
        className="z-[42069] select-none"
        expand={false}
        position="bottom-right"
        swipeDirections={['right', 'left', 'top', 'bottom']}
        theme="light"
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
          },
        }}
      />
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
