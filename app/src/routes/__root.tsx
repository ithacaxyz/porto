import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { Porto } from 'porto'
import * as React from 'react'
import { type appStore, useAppStore } from '../lib/app'
import { messenger } from '../lib/porto'
import { Header } from '../ui/Header'

export const Route = createRootRouteWithContext<{
  appState: appStore.State
  portoState: Porto.State
}>()({
  component: RouteComponent,
})

function RouteComponent() {
  const mode = useAppStore((state) => state.mode)

  const elementRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height, width } = entry.contentRect
        if (mode === 'popup')
          window.resizeTo(width, height + 30) // add 30px to account for title bar
        else messenger.send('__internal', { type: 'resize', height, width })
      }
    })

    resizeObserver.observe(element)
    return () => {
      resizeObserver.unobserve(element)
    }
  }, [mode])

  return (
    <div
      {...{ [`data-${mode}`]: '' }} // for conditional styling based on dialog mode ("iframe" or "popup")
      ref={elementRef}
      className="h-fit min-w-[282px] bg-neutral-0 dark:bg-neutral-1"
    >
      <Header />
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
