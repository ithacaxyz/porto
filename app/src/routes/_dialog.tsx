import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import LucideGlobe from '~icons/lucide/globe'
import LucideX from '~icons/lucide/x'

export const Route = createFileRoute('/_dialog')({
  component: RouteComponent,
})

function RouteComponent() {
  const mode = Dialog.useStore((state) => state.mode)
  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)
  const icon = Dialog.useStore((state) => state.referrer?.icon)
  const request = Hooks.useRequest(porto)

  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const titlebarRef = React.useRef<HTMLDivElement | null>(null)
  React.useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const { height, width } = entry.contentRect
          const titlebarHeight = titlebarRef.current?.clientHeight ?? 0
          if (mode === 'popup') {
            const topbarHeight = 30
            window.resizeTo(width, height + titlebarHeight + topbarHeight)
          } else if (mode === 'iframe')
            porto.messenger.send('__internal', {
              type: 'resize',
              height: height + titlebarHeight + 2,
            })
        }
      })
    })

    resizeObserver.observe(element)
    return () => {
      resizeObserver.unobserve(element)
    }
  }, [mode])

  const id = request?.request.id ? request.request.id.toString() : '-1'

  return (
    <>
      <header
        ref={titlebarRef}
        {...{ [`data-${mode}`]: '' }}
        className="fixed flex h-navbar w-full items-center justify-between border border-gray4 bg-gray2 px-3 pt-2 pb-1.5 data-iframe:rounded-t-[14px]"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded-[5px] bg-gray6">
            {icon ? (
              <div className="p-[3px]">
                <img src={icon} alt={hostname} className="size-full" />
              </div>
            ) : (
              <LucideGlobe className="size-3.5 text-black dark:text-white" />
            )}
          </div>
          <div className="font-normal text-[14px] text-gray9 leading-[22px]">
            {hostname}
          </div>
        </div>

        <button
          type="button"
          onClick={() => Actions.rejectAll(porto)}
          title="Close Dialog"
        >
          <LucideX className="size-4.5 text-gray9" />
        </button>
      </header>

      <div
        ref={contentRef}
        {...{ [`data-${mode}`]: '' }} // for conditional styling based on dialog mode ("in-data-iframe:..." or "in-data-popup:...")
        className="flex not-data-popup-standalone:h-fit flex-col overflow-hidden border-gray4 bg-gray1 pt-titlebar data-popup-standalone:min-h-dvh data-iframe:rounded-[14px] data-iframe:border"
      >
        <div
          className="flex flex-grow"
          key={id} // rehydrate on id changes
        >
          <Outlet />
        </div>
      </div>
    </>
  )
}
