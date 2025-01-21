import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { Porto } from 'porto'
import * as React from 'react'
import * as v from 'valibot'
import { Header } from '../ui/Header'

export const Route = createRootRouteWithContext<{
  portoState: Porto.State
}>()({
  component: RouteComponent,
  // extract critical iframe properties from search (for secure properties use messenger API)
  validateSearch: v.object({
    referrer: v.string(),
    type: v.union([v.literal('iframe'), v.literal('popup')]),
  }),
})

function RouteComponent() {
  const { referrer, type } = Route.useSearch()
  return (
    <div
      {...{ [`data-${type}`]: '' }} // for conditional styling based on dialog type
      className="h-fit w-full bg-neutral-0 dark:bg-neutral-1"
    >
      <Header referrer={referrer} />
      <Outlet />
      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </React.Suspense>
    </div>
  )
}

const TanStackRouterDevtools =
  import.meta.env.PROD || window !== window.parent || Boolean(window.opener)
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )
