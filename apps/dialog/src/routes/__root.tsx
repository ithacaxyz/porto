import { Porto } from '@porto/apps'
import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'

import * as Dialog from '~/lib/Dialog'
import LucideGlobe from '~icons/lucide/globe'
import LucideX from '~icons/lucide/x'

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  React.useEffect(() => {
    // Note: we already call `porto.ready()` optimistically in `main.tsx`, but
    // we should call it here incase it didn't resolve due to a race condition.
    Porto.porto.ready()
  }, [])

  const mode = Dialog.useStore((state) => state.mode)
  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)
  const icon = Dialog.useStore((state) => state.referrer?.icon)
  const request = Hooks.useRequest(Porto.porto)

  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const titlebarRef = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return

    let frameId: number
    let lastHeight: number | undefined

    const resizeObserver = new ResizeObserver((entries) => {
      // cancel any pending animation frame before requesting a new one
      cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        for (const entry of entries) {
          if (!entry) return

          const { height, width } = entry.contentRect
          // Only send resize if height actually changed
          if (height === lastHeight) return

          const titlebarHeight = titlebarRef.current?.clientHeight ?? 0
          const modeHeight = mode === 'popup' ? 30 : 2
          const totalHeight = height + titlebarHeight + modeHeight

          lastHeight = height

          if (mode === 'popup') {
            window.resizeTo(width, totalHeight)
          } else if (mode === 'iframe' || mode === 'inline-iframe') {
            Porto.porto.messenger.send('__internal', {
              type: 'resize',
              height: totalHeight,
            })
          }
        }
      })
    })

    resizeObserver.observe(element)
    return () => {
      // cancel any pending animation frame before disconnecting the observer
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [mode])

  const id = request?.request.id ? request.request.id.toString() : '-1'

  const dataMode = `data-${mode === 'inline-iframe' ? 'iframe' : mode}`

  return (
    <>
      <HeadContent />

      <div data-dialog>
        <header
          ref={titlebarRef}
          data-element="dialog-header"
          {...{
            [dataMode]: '',
          }}
          className="fixed flex h-navbar w-full items-center justify-between border border-primary bg-secondary px-3 pt-2 pb-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-[5px] bg-gray6">
              {icon ? (
                <div className="p-[3px]">
                  <img
                    src={icon}
                    alt={hostname}
                    className="size-full text-transparent"
                  />
                </div>
              ) : (
                <LucideGlobe className="size-3.5 text-primary" />
              )}
            </div>
            <div className="font-normal text-[14px] text-secondary leading-[22px]">
              {hostname}
            </div>
          </div>

          {mode !== 'inline-iframe' && (
            <button
              type="button"
              onClick={() => Actions.rejectAll(Porto.porto)}
              title="Close Dialog"
            >
              <LucideX className="size-4.5 text-secondary" />
            </button>
          )}
        </header>

        <div
          ref={contentRef}
          {...{ [dataMode]: '' }} // for conditional styling based on dialog mode ("in-data-iframe:..." or "in-data-popup:...")
          className="flex not-data-popup-standalone:h-fit flex-col overflow-hidden border-primary bg-primary pt-titlebar data-popup-standalone:min-h-dvh data-iframe:rounded-[14px] data-iframe:border"
        >
          <div
            className="flex flex-grow *:w-full"
            key={id} // rehydrate on id changes
          >
            <Outlet />
          </div>
        </div>
      </div>

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
