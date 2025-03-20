import { Porto } from '@porto/apps'
import { IndeterminateLoader } from '@porto/apps/components'
import { type VariantProps, cva, cx } from 'cva'
import { Hooks } from 'porto/remote'
import type * as React from 'react'

import { StringFormatter } from '~//utils'
import ChevronDown from '~icons/lucide/chevron-down'

export function Layout(props: Layout.Props) {
  const { children, loading, loadingTitle } = props

  if (loading)
    return (
      <div className="flex flex-grow p-3">
        <IndeterminateLoader title={loadingTitle} />
      </div>
    )
  return (
    <div className="flex flex-grow flex-col space-y-3 py-3">{children}</div>
  )
}

export namespace Layout {
  export type Props = {
    children: React.ReactNode
  } & (
    | {
        loading?: boolean
        loadingTitle: string
      }
    | {
        loading?: undefined
        loadingTitle?: undefined
      }
  )

  //////////////////////////////////////////////////////////////////
  // Headers
  //////////////////////////////////////////////////////////////////

  export function Header(props: Header.Props) {
    return (
      <div className={cx('flex flex-col px-3', props.className)}>
        {props.children}
      </div>
    )
  }

  export namespace Header {
    export type Props = {
      children: React.ReactNode
      className?: string
    }

    export function Default(props: Default.Props) {
      const { icon: Icon, title, content, variant } = props
      return (
        <div>
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={Default.className({ variant })}>
                <Icon className="size-[18px] text-current" />
              </div>
            )}
            <div className="font-medium text-[18px] text-primary">{title}</div>
          </div>

          <div className="mt-1.5 text-[15px] text-primary leading-[22px]">
            {content}
          </div>
        </div>
      )
    }

    // Default Header
    export namespace Default {
      export interface Props extends VariantProps<typeof className> {
        icon?: React.FC<React.SVGProps<SVGSVGElement>> | undefined
        title: string
        content: React.ReactNode
      }

      export const className = cva(
        'flex size-8 items-center justify-center rounded-full',
        {
          variants: {
            variant: {
              default: 'bg-accentTint text-accent',
              primary: 'bg-accentTint text-accent',
              warning: 'bg-warningTint text-warning',
              destructive: 'bg-destructive text-destructive',
            },
          },
          defaultVariants: {
            variant: 'default',
          },
        },
      )
    }
  }

  //////////////////////////////////////////////////////////////////
  // Content
  //////////////////////////////////////////////////////////////////

  export function Content(props: {
    children: React.ReactNode
    className?: string
  }) {
    return (
      <div className={cx('flex-grow px-3', props.className)}>
        {props.children}
      </div>
    )
  }

  //////////////////////////////////////////////////////////////////
  // Footers
  //////////////////////////////////////////////////////////////////

  export function Footer(props: Footer.Props) {
    return (
      <div className={cx('space-y-3', props.className)}>{props.children}</div>
    )
  }

  export namespace Footer {
    export type Props = {
      children: React.ReactNode
      className?: string
    }

    // Actions Footer
    export function Actions(props: Actions.Props) {
      return <div className="flex gap-2 px-3">{props.children}</div>
    }

    export namespace Actions {
      export type Props = {
        children: React.ReactNode
      }
    }

    // Account Footer
    export function Account(props: Account.Props) {
      const { onClick } = props

      const address = props.address ?? Hooks.useAccount(Porto.porto)?.address
      if (!address) return null
      return (
        <div className="flex justify-between border-primary border-t px-3 pt-3">
          <div className="text-[13px] text-secondary leading-[22px]">
            Account
          </div>

          <button
            disabled={!onClick}
            className="-my-1 -mx-2 flex items-center gap-1.5 rounded-lg px-2 py-1 hover:not-disabled:bg-surface"
            onClick={onClick}
            type="button"
          >
            <div className="font-medium text-[14px] text-primary">
              {StringFormatter.truncate(address, { start: 8, end: 6 })}
            </div>
            {onClick && <ChevronDown className="size-4 text-secondary" />}
          </button>
        </div>
      )
    }

    export namespace Account {
      export type Props = {
        address?: string | undefined
        onClick?: () => void
      }
    }
  }
}
