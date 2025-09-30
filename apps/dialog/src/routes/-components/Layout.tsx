import { Screen } from '@porto/ui'
import { cva, cx, type VariantProps } from 'cva'
import { Address } from 'ox'
import type * as React from 'react'

import { StringFormatter } from '~//utils'
import ChevronDown from '~icons/lucide/chevron-down'

export function Layout(props: Layout.Props) {
  return <Screen {...props} />
}

export namespace Layout {
  export type Props = {
    children?: React.ReactNode | undefined
  }

  //////////////////////////////////////////////////////////////////
  // Headers
  //////////////////////////////////////////////////////////////////

  export function Header(props: Header.Props) {
    return (
      <div className={cx('flex flex-col p-3 pb-2', props.className)}>
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
      const { icon: Icon, title, content, subContent, variant } = props
      return (
        <div className="flex flex-col gap-3 pb-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={Default.className({ variant })}>
                <Icon className="size-[18px] text-current" />
              </div>
            )}
            <div className="font-medium text-[18px] text-th_base">{title}</div>
          </div>
          {(content || subContent) && (
            <div className="flex flex-col gap-0.5">
              {content && (
                <div className="text-[15px] text-th_base leading-[22px]">
                  {content}
                </div>
              )}
              {subContent && (
                <div className="text-[15px] text-th_base-secondary leading-[20px]">
                  {subContent}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    // Default Header
    export namespace Default {
      export interface Props extends VariantProps<typeof className> {
        content?: React.ReactNode
        icon?: React.FC<React.SVGProps<SVGSVGElement>> | undefined
        subContent?: React.ReactNode
        title: string
      }

      // header icon
      export const className = cva(
        'flex size-8 items-center justify-center rounded-full',
        {
          defaultVariants: {
            variant: 'default',
          },
          variants: {
            variant: {
              default: 'bg-th_badge-info text-th_badge-info',
              destructive: 'bg-th_negative text-th_negative',
              success: 'bg-th_positive text-th_positive',
              warning: 'bg-th_badge-warning text-th_badge-warning',
            },
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
      <div className={cx('flex-grow px-3 pb-[12px]', props.className)}>
        {props.children}
      </div>
    )
  }

  //////////////////////////////////////////////////////////////////
  // Footers
  //////////////////////////////////////////////////////////////////

  export function Footer(props: Footer.Props) {
    return (
      <div
        className={cx(
          'flex min-h-[48px] w-full flex-col items-center justify-center space-y-3 pb-3',
          props.className,
        )}
      >
        {props.children}
      </div>
    )
  }

  export namespace Footer {
    export type Props = {
      children: React.ReactNode
      className?: string
    }

    // Actions Footer
    export function Actions(props: Actions.Props) {
      return <div className="flex w-full gap-2 px-3">{props.children}</div>
    }

    export namespace Actions {
      export type Props = {
        children: React.ReactNode
      }
    }

    // Account Footer
    export function Account(props: Account.Props) {
      const { onClick } = props
      const address = Address.checksum(props.address)
      return (
        <div className="flex h-full w-full items-center justify-between border-th_base border-t px-3 pt-3">
          <div className="text-[13px] text-th_base-secondary">Account</div>

          <button
            className="-my-1 -mx-2 flex items-center gap-1.5 rounded-lg px-2 py-1 hover:not-disabled:bg-th_base-hovered"
            disabled={!onClick}
            onClick={onClick}
            type="button"
          >
            <div
              className="font-medium text-[14px] text-th_base"
              title={address}
            >
              {StringFormatter.truncate(address, { end: 6, start: 8 })}
            </div>
            {onClick && (
              <ChevronDown className="size-4 text-th_base-secondary" />
            )}
          </button>
        </div>
      )
    }

    export namespace Account {
      export type Props = {
        address: Address.Address
        onClick?: () => void
      }
    }
  }
}
