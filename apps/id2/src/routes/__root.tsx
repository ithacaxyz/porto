/// <reference types="vite/client" />

import * as UI from '@porto/ui'
import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import {
  createRootRouteWithContext,
  ErrorComponent,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type * as React from 'react'
import { WagmiProvider } from 'wagmi'

import appCss from '~/app.css?url'
import { NotFound } from '~/components/NotFound'
import * as Query from '~/lib/Query.ts'
import * as Wagmi from '~/lib/Wagmi.ts'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <ErrorComponent error={props.error} />
      </RootDocument>
    )
  },
  head: () => ({
    links: [
      { href: appCss, rel: 'stylesheet' },
      {
        href: '/apple-touch-icon.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
      {
        href: '/favicon-32x32.png',
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        href: '/favicon-16x16.png',
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
      },
      { color: '#fffff', href: '/site.webmanifest', rel: 'manifest' },
      { href: '/favicon.ico', rel: 'icon' },
    ],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        content: 'width=device-width, initial-scale=1',
        name: 'viewport',
      },
      { content: 'Porto ID', name: 'title' },
      { content: 'Porto Wallet ID App', name: 'description' },
    ],
  }),
  notFoundComponent: () => <NotFound />,
})

function Providers(props: React.PropsWithChildren) {
  const queryClient = useQueryClient()

  return (
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: Query.persister }}
      >
        <UI.Ui>
          {/* @ts-expect-error Vite version mismatch */}
          {props.children}
        </UI.Ui>
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html className="scheme-light-dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
