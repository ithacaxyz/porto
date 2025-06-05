import { Button } from '@porto/apps/components'
import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

import CircleHelp from '~icons/lucide/circle-help'

export function Layout(props: PropsWithChildren) {
  return <main className="mx-auto flex h-full max-lg:flex-col" {...props} />
}

export namespace Layout {
  export function Hero(props: PropsWithChildren) {
    return <div className="fixed inset-4 w-hero max-lg:hidden" {...props} />
  }

  export function Content(props: PropsWithChildren) {
    const { children, ...rest } = props
    return (
      <div
        className="ml-[calc(var(--spacing-hero)+1rem)] flex w-full flex-1 flex-col py-6 max-md:py-4 max-lg:ml-0"
        {...rest}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-10 max-sm:px-4">
          {props.children}
        </div>
      </div>
    )
  }

  export function Header(props: {
    left?: React.ReactNode | undefined
    right?: React.ReactNode | undefined
  }) {
    const { left, right } = props
    return (
      <div className="flex items-center justify-between">
        {left}
        {right ?? (
          <Button render={<Link to="/about" />} size="square" variant="outline">
            <CircleHelp className="size-5 text-gray10" />
          </Button>
        )}
      </div>
    )
  }

  export function IntegrateFooter() {
    return (
      <div className="mt-auto mb-4 flex h-min min-w-[500px] items-center justify-center gap-x-3 max-lg:hidden">
        <p className="font-[500] text-gray10 text-sm">
          Want to integrate Porto with your application?
        </p>
        <Button
          className="h-min w-min! px-2! py-1"
          render={
            // biome-ignore lint/a11y/useAnchorContent:
            <a href="https://porto.sh" rel="noreferrer" target="_blank" />
          }
        >
          Learn more
        </Button>
      </div>
    )
  }
}
