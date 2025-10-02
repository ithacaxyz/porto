import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        content: __APP_VERSION__,
        name: 'x-app-version',
      },
      {
        content:
          import.meta.env.VITE_VERCEL_ENV !== 'production'
            ? 'noindex, nofollow'
            : 'index, follow',
        name: 'robots',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <>
      <HeadContent />

      <Outlet />

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

      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </React.Suspense>
    </>
  )
}
