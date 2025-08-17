/// <reference types="vite/client" />

import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import baseCss from '~/styles.css?url'

export const Route = createRootRoute({
  errorComponent: (props) => {
    console.info('rootRoute errorComponent', props)
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
    console.info('rootRoute notFoundComponent', props)
    return <NotFound />
  },
  pendingComponent: (props) => {
    console.info('rootRoute pendingComponent', props)
    return <div>[__root.tsx] Loading…</div>
  },
  shellComponent: RootDocument,
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
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}
