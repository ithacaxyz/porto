import type { ReactNode } from 'react'
import { a, useTransition, useSpring } from '@react-spring/web'
import { css, cx } from '../../styled-system/css'
import { useRef } from 'react'
import { Frame } from '../Frame/Frame.js'

export interface ScreenProps {
  layout?: 'compact' | 'full'
  children?: ReactNode
  loading?: boolean
  loadingTitle?: string
  name?: string
}

export function Screen({
  name,
  layout,
  loading,
  children,
}: ScreenProps) {
  const mode = Frame.useMode()
  layout ??= mode === 'dialog' ? 'compact' : 'full'

  const appear = useTransition(
    { loading, show: !loading, children, name },
    {
      keys: ({ loading, name }) => (loading ? 'loading' : (name ?? '')),
      initial: {
        opacity: 1,
        transform: 'translate3d(0px, 0, 0)',
      },
      from: {
        opacity: 0,
        transform: 'translate3d(20px, 0, 0)',
      },
      enter: {
        delay: 80,
        opacity: 1,
        transform: 'translate3d(0px, 0, 0)',
      },
      leave: {
        opacity: 0,
        transform: 'translate3d(-20px, 0, 0)',
        config: {
          mass: 1,
          tension: 2000,
          friction: 80,
        },
      },
      config: {
        mass: 2,
        tension: 1400,
        friction: 120,
      },
    },
  )

  const screenRef = useRef<HTMLDivElement>(null)
  const screenSpring = useSpring({
    from: { height: 0 },
    config: {
      mass: 1,
      tension: 2000,
      friction: 80,
    },
  })

  return (
    <div
      className={cx(
        css({
          overflow: 'hidden',
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
      <a.div
        className={css({
          flex: '1 1 auto',
          minHeight: 0,
          width: '100%',
          position: 'relative',
        })}
        style={screenSpring}
      >
        {appear(
          (styles, { show, children }) =>
            show && (
              <a.div
                className={css({
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  inset: '0 0 auto',
                })}
                style={{
                  ...styles,
                  opacity: styles.opacity.to([0, 0.2, 1], [0, 0, 1]),
                }}
              >
                <div
                  ref={(el) => {
                    if (!el) return

                    screenSpring.height.start(el.clientHeight, {
                      immediate: !screenRef.current,
                    })

                    // make sure the initial height doesnt
                    // animate, even with double rendering
                    queueMicrotask(() => {
                      screenRef.current = el
                    })
                  }}
                >
                  {children}
                </div>
              </a.div>
            ),
        )}
      </a.div>
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
