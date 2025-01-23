import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { Porto } from 'porto'
import * as React from 'react'
import LucideGlobe from '~icons/lucide/globe'
import LucideX from '~icons/lucide/x'
import { type appStore, useAppStore } from '../lib/app'
import { messenger } from '../lib/porto'
import { requestsStore } from '../lib/requests'

export const Route = createRootRouteWithContext<{
  appState: appStore.State
  portoState: Porto.State
}>()({
  component: RouteComponent,
})

function RouteComponent() {
  const mode = useAppStore((state) => state.mode)
  const hostname = useAppStore((state) => new URL(state.targetOrigin).hostname)

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
    <div ref={elementRef}>
      <div
        {...{ [`data-${mode}`]: '' }} // for conditional styling based on dialog mode ("in-data-iframe:..." or "in-data-popup:...")
        className="flex h-fit min-h-[300px] min-w-[282px] flex-col overflow-hidden border-blackA1 bg-gray1 data-iframe:rounded-[14px] data-iframe:border dark:border-whiteA1 dark:bg-gray2"
      >
        <header className="flex items-center justify-between border-blackA1 border-b bg-blackA1 px-3 pt-2 pb-1.5 dark:border-whiteA1 dark:bg-whiteA1">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-[5px] bg-gray6">
              <LucideGlobe className="size-3.5 text-black dark:text-white" />
            </div>
            <div className="font-normal text-[14px] text-gray9 leading-[22px]">
              {hostname}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const state = requestsStore.getState()
              const request = state.requests[0]
              if (request) state.reject(request)
            }}
            title="Close Dialog"
          >
            <LucideX className="size-4.5 text-gray9" />
          </button>
        </header>

        <div className="flex flex-grow flex-col">
          <Outlet />
        </div>

        <React.Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
      </div>
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
