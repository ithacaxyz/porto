import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export interface ScreenProps {
  layout: 'compact' | 'full'
  children?: ReactNode
  loading?: boolean
  loadinTitle?: string
  // header?: ReactNode
  // actions?:
  //   | ReactNode
  //   | {
  //       primary?: ReactNode
  //       secondary?: ReactNode
  //     }
}

export function Screen({ layout, children }: ScreenProps) {
  const mode = Frame.useMode()
  layout ??= mode === 'dialog' ? 'compact' : 'full'
  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: 0,
          padding: 12,
          width: '100%',
        }),
        layout === 'full' &&
          css({
            padding: 24,
          }),
      )}
    >
      {children}
    </div>
  )
}

function ScreenHeader({
  content,
  icon,
  layout,
  title,
}: {
  content?: ReactNode
  icon?: ReactNode
  layout?: 'compact' | 'full'
  title: string
}) {
  const mode = Frame.useMode()
  layout ??= mode === 'dialog' ? 'compact' : 'full'
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

Screen.Header = ScreenHeader
