import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import * as React from 'react'

import { porto } from '../lib/Porto'

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  React.useEffect(() => {
    // Note: we already call `porto.ready()` optimistically in `main.tsx`, but
    // we should call it here incase it didn't resolve due to a race condition.
    porto.ready()
  }, [])

  return (
    <>
      <HeadContent />

      <Outlet />

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
