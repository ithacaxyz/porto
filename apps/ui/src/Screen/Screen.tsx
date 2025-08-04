import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export interface ScreenProps {
  layout: 'compact' | 'full'
  header?: ReactNode
  children?: ReactNode
  actions?:
    | ReactNode
    | {
        primary?: ReactNode
        secondary?: ReactNode
      }
}

export function Screen({ children }: ScreenProps) {
  const mode = Frame.useMode()
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
        mode === 'full' &&
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
  icon,
  title,
  content,
}: {
  icon?: ReactNode
  title: string
  content?: ReactNode
}) {
  const mode = Frame.useMode()
  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          lineHeight: 1.5,
          paddingBottom: 8,
        }),
        mode === 'full' &&
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
            gap: 8,
            justifyContent: 'flex-start',
          }),
          mode === 'full' &&
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
                height: 32,
                overflow: 'hidden',
                placeItems: 'center',
                width: 32,
              }),
              mode === 'full' &&
                css({
                  height: 64,
                  width: 64,
                }),
            )}
          >
            {icon}
          </div>
        )}
        <div
          className={cx(
            mode === 'dialog' &&
              css({
                fontSize: 18,
              }),
            mode === 'full' &&
              css({
                fontSize: 28,
              }),
          )}
        >
          {title}
        </div>
      </div>
      <div
        className={cx(
          mode === 'dialog' &&
            css({
              fontSize: 15,
            }),
          mode === 'full' &&
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
