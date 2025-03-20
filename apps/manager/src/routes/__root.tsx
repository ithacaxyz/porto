import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeadContent />

      <Outlet />

      <Toaster
        theme="light"
        expand={false}
        duration={3_000}
        position="top-right"
        className="z-[42069] select-none"
        swipeDirections={['right', 'left', 'top', 'bottom']}
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
          },
        }}
      />

      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
        <TanStackQueryDevtools
          position="left"
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </React.Suspense>
    </>
  )
}

const TanStackRouterDevtools =
  import.meta.env.PROD || window !== window.parent || Boolean(window.opener)
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

const TanStackQueryDevtools =
  import.meta.env.PROD || window !== window.parent || Boolean(window.opener)
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      )
