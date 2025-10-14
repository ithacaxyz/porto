/// <reference types="vite/client" />

import { Ui } from '@porto/ui'

import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import type * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.tsx'
import { NotFound } from '~/components/NotFound.tsx'
import appCss from '~/styles.css?url'

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
      { color: '#fffff', href: '/site.webmanifest', rel: 'manifest' },

      { href: '/icon-light.png', rel: 'icon', type: 'image/png' },
      {
        href: '/icon-dark.png',
        media: '(prefers-color-scheme: light)',
        rel: 'icon',
        type: 'image/png',
      },
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
        <Ui assetsBaseUrl="/id2/ui">{children}</Ui>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
