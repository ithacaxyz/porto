import { Button } from '@porto/apps/components'
import { Link } from '@tanstack/react-router'
import { cx } from 'cva'
import type { PropsWithChildren } from 'react'

import CircleHelp from '~icons/lucide/circle-help'

export function Layout(props: PropsWithChildren) {
  return <main className="mx-auto flex h-full max-lg:flex-col" {...props} />
}

export namespace Layout {
  export function Hero(props: PropsWithChildren) {
    return <div className="fixed inset-4 w-[45vw] max-lg:hidden" {...props} />
  }

  export function Content(props: PropsWithChildren) {
    return (
      <div
        className="ml-[45vw] flex w-full flex-1 flex-col gap-y-4 p-6 px-10 tabular-nums max-md:p-4 max-lg:ml-0"
        {...props}
      />
    )
  }

  export function Header(props: {
    action?: React.ReactNode | undefined
    title?: string | undefined
    titleClassName?: string | undefined
  }) {
    const { action, title = 'Porto', titleClassName } = props
    return (
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cx(
              titleClassName,
              'font-[500] text-[24px] min-lg:opacity-0',
            )}
          >
            {title}
          </div>
        </div>
        {action ?? (
          <Button render={<Link to="/about" />} variant="outline" size="square">
            <CircleHelp className="size-5 text-gray10" />
          </Button>
        )}
      </div>
    )
  }

  export function IntegrateFooter() {
    return (
      <div className="mt-auto flex h-min min-w-[500px] items-center justify-center gap-x-3 max-lg:hidden">
        <p className="font-[500] text-gray10 text-sm">
          Want to integrate Porto with your application?
        </p>
        <Button
          className="h-min w-min! px-2! py-1"
          render={
            // biome-ignore lint/a11y/useAnchorContent:
            <a href="https://porto.sh" target="_blank" rel="noreferrer" />
          }
        >
          Learn more
        </Button>
      </div>
    )
  }
}
