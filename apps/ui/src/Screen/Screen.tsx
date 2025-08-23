import type { ButtonHTMLAttributes, ReactNode } from 'react'
import ChevronRight from '~icons/lucide/chevron-right'
import { css, cx } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'
import { Frame } from '../Frame/Frame.js'

export function Screen({
  children,
  layout,
  bottomAction,
  compactPadding = false,
}: Screen.Props) {
  const frame = Frame.useFrame()

  layout ??= frame.mode === 'dialog' ? 'compact' : 'full'

  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flex: '0 0 auto',
          flexDirection: 'column',
          width: '100%',
        }),
        layout === 'compact' &&
          css({
            minHeight: 0,
          }),
        layout === 'full' &&
          css({
            '@container (min-width: 480px)': {
              overflowY: 'hidden',
            },
            flex: '1 1 auto',
            minHeight: 120,
            overflowY: 'auto',
          }),
      )}
    >
      <div
        className={cx(
          css({
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: 0,
            position: 'relative',
            width: '100%',
          }),
        )}
      >
        <div
          className={cx(
            css({
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }),
            layout === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  flex: '0 0 auto',
                  padding: 12,
                },
                flex: '1 1 auto',
              }),
            layout === 'compact' &&
              compactPadding &&
              css({
                padding: 16,
              }),
          )}
        >
          {children}
          {bottomAction && (
            <ScreenBottomAction layout={layout} {...bottomAction} />
          )}
        </div>
      </div>
    </div>
  )
}

function ScreenHeader({ content, icon, layout, title }: Screen.HeaderProps) {
  const frame = Frame.useFrame()
  layout ??= frame.mode === 'dialog' ? 'compact' : 'full'

  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          lineHeight: 1.5,
        }),
        layout === 'compact' &&
          css({
            paddingBottom: 8,
          }),
        layout === 'full' &&
          css({
            '@container (min-width: 480px)': {
              paddingBottom: 40,
            },
            flex: '1 0 auto',
            justifyContent: 'center',
            paddingBottom: 16,
          }),
      )}
    >
      <div
        className={cx(
          css({
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'flex-start',
          }),
          layout === 'compact' &&
            css({
              gap: 8,
            }),
          layout === 'full' &&
            css({
              flexDirection: 'column',
              gap: 16,
            }),
        )}
      >
        {icon && (
          <div
            className={cx(
              css({
                '& > svg': {
                  height: '62.5%',
                  width: '62.5%',
                },
                backgroundColor: 'var(--background-color-th_badge-info)',
                borderRadius: '50%',
                color: 'var(--text-color-th_badge-info)',
                display: 'grid',
                overflow: 'hidden',
                placeItems: 'center',
              }),
              layout === 'compact' && css({ height: 32, width: 32 }),
              layout === 'full' && css({ height: 64, width: 64 }),
            )}
          >
            {icon}
          </div>
        )}
        <div
          className={cx(
            layout === 'compact' && css({ fontSize: 18 }),
            layout === 'full' && css({ fontSize: 28 }),
          )}
        >
          {title}
        </div>
      </div>
      <div
        className={cx(
          layout === 'compact' &&
            css({
              fontSize: 15,
              textAlign: 'left',
            }),
          layout === 'full' &&
            css({
              fontSize: 18,
              textAlign: 'center',
            }),
        )}
      >
        {content}
      </div>
    </div>
  )
}

function ScreenBottomAction({
  children,
  layout,
  ...props
}: Screen.BottomActionProps) {
  return (
    <div
      className={cx(
        css({
          borderTop: '1px solid var(--border-color-th_base)',
          display: 'flex',
          width: '100%',
        }),
        layout === 'full' &&
          css({
            '@container (min-width: 480px)': {
              marginTop: 12,
            },
          }),
      )}
    >
      <ButtonArea
        className={cx(
          css({
            alignItems: 'center',
            borderRadius: 'var(--radius-th_large)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            display: 'flex',
            fontSize: 14,
            fontWeight: 500,
            justifyContent: 'space-between',
            outlineOffset: -2,
            padding: 12,
            width: '100%',
          }),
          layout === 'full' &&
            css({
              '@container (min-width: 480px)': {
                borderRadius: 'var(--radius-th_medium)',
              },
              borderRadius: 0,
            }),
        )}
        {...props}
      >
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            gap: 6,
          })}
        >
          {children}
        </div>
        <ChevronRight
          className={css({
            color: 'var(--text-color-th_base-secondary)',
          })}
          height={20}
          width={20}
        />
      </ButtonArea>
    </div>
  )
}

export namespace Screen {
  export interface Props {
    bottomAction?: ButtonHTMLAttributes<HTMLButtonElement> | undefined
    children?: ReactNode
    layout?: Layout | undefined
    compactPadding?: boolean | undefined // only used to migrate screens, will be removed
  }

  export interface HeaderProps {
    content?: ReactNode
    icon?: ReactNode
    layout?: Layout | undefined
    title: string
  }

  export interface BottomActionProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    layout: Layout
  }

  export type Layout = 'compact' | 'full'

  export const Header = ScreenHeader
}
