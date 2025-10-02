/// <reference types="vite/client" />

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type * as React from 'react'

import appCss from '~/app.css?url'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.tsx'
import { NotFound } from '~/components/NotFound.tsx'

const getCookieServerFn = createServerFn().handler(async () =>
  getCookie('wagmi.store'),
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
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
  loader: async () => {
    const deferredPromise = getCookieServerFn()
    return { deferredPromise }
  },
  notFoundComponent: () => <NotFound />,
})

export const persister = createAsyncStoragePersister({
  key: 'porto.id',
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

// function Providers(
//   props: React.PropsWithChildren<{
//     initialState?: State | undefined
//     children: React.ReactNode
//   }>,
// ) {
//   return (
//     <React.Suspense fallback={<div>Loading...</div>}>
//       <WagmiProvider config={Wagmi.config} initialState={props.initialState}>
//         <UI.Ui>
//           {/** biome-ignore lint/complexity/noUselessFragments: _ */}
//           <React.Fragment>{props.children}</React.Fragment>
//         </UI.Ui>
//       </WagmiProvider>
//     </React.Suspense>
//   )
// }

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // const { deferredPromise } = Route.useLoaderData()

  // const [awaitedCookie] = useAwaited({ promise: deferredPromise })
  // const initialState = cookieToInitialState(Wagmi.config, awaitedCookie)
  return (
    <html className="scheme-light-dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
