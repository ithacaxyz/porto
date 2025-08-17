/// <reference types="vite/client" />

import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  ReactQueryDevtools,
  ReactQueryDevtoolsPanel,
} from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  type RouteComponent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type { GetAccountReturnType } from '@wagmi/core'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import baseCss from '~/styles.css?url'

interface RootRouteContext {
  queryClient: QueryClient
  account: GetAccountReturnType
}

// @ts-expect-error
const RootComponent: RouteComponent = (props) => {
  return (
    <RootDocument {...props}>
      <Outlet />
    </RootDocument>
  )
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  // component: RootComponent,
  errorComponent: (props) => {
    console.info(
      '[__root.tsx] errorComponent',
      JSON.stringify(props, undefined, 2),
    )
    return <DefaultCatchBoundary {...props} />
  },
  head: () => ({
    links: [
      { href: baseCss, rel: 'stylesheet' },
      { href: '/icon-light.png', rel: 'icon', type: 'image/png' },
      {
        href: '/icon-dark.png',
        media: '(prefers-color-scheme: light)',
        rel: 'icon',
        type: 'image/png',
      },
    ],
    meta: [
      { charSet: 'utf-8' },
      { title: 'Porto ID App' },
      { content: '#191919', name: 'theme-color' },
      { content: '/banner.png', property: 'og:image' },
      { content: __APP_VERSION__, name: 'x-app-version' },
      { content: 'Porto Wallet ID App', name: 'description' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      {
        content:
          import.meta.env.VITE_VERCEL_ENV !== 'production'
            ? 'noindex, nofollow'
            : 'index, follow',
        name: 'robots',
      },
    ],
  }),
  notFoundComponent: (props) => {
    console.info(
      '[__root.tsx] notFoundComponent',
      JSON.stringify(props, undefined, 2),
    )
    return <NotFound />
  },
  pendingComponent: (props) => {
    console.info(
      '[__root.tsx] pendingComponent',
      JSON.stringify(props, undefined, 2),
    )
    return (
      <div>
        <p>[__root.tsx] Loading…</p>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </div>
    )
  },

  shellComponent: RootDocument,
  ssr: false,
  wrapInSuspense: true,
})

function RootDocument(props: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {props.children}
        <React.Suspense fallback={<div>[__root.tsx.devtools] Loading…</div>}>
          <TanStackDevtools
            config={{
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query_',
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtools />,
              },
            ]}
          />
        </React.Suspense>
        <Scripts />
      </body>
    </html>
  )
}
