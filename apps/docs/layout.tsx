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
      <SunsetBanner />
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

function SunsetBanner() {
  return (
    <div className="border-gray4 border-b bg-gray2 px-4 py-2 text-center font-[400] text-[14px] text-gray12 leading-[20px] dark:bg-gray1">
      Porto is sunsetting. Please move any funds out before July 24, 2026.
      Details{' '}
      <a
        aria-label="Read the Porto sunsetting details"
        className="font-[500] underline underline-offset-2"
        href="https://ithaca.xyz/updates/sunsetting-porto"
      >
        here
      </a>
      .
    </div>
  )
}

export function TopNavEnd() {
  return (
    <div className="max-[1080px]:hidden">
      <Connect variant="topnav" />
    </div>
  )
}
