import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'
import { useId } from 'react'

export interface ScreenProps {
  children?: ReactNode
  layout?: 'compact' | 'full'
}

export function Screen({ children, layout }: ScreenProps) {
  const frame = Frame.useFrame()
  const id = useId()

  layout ??= frame.mode === 'dialog' ? 'compact' : 'full'

  return (
    <div
      ref={(el) => {
        frame.setScreen(el, id)
      }}
      className={cx(
        css({
          flex: '0 0 auto',
          display: 'flex',
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
          layout === 'compact' && css({ padding: 12 }),
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
                },
                flex: '1 1 auto',
                padding: 24,
              }),
          )}
        >
          {children}
        </div>
      </div>
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

Screen.Header = ScreenHeader
