import { a, useSpring, useTransition } from '@react-spring/web'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { css, cx } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export interface ScreenProps {
  layout?: 'compact' | 'full'
  children?: ReactNode
  loading?: boolean
  loadingTitle?: string
  name?: string
}

const SHOW_LOADER_DELAY = 200

export function Screen({
  name,
  layout,
  loading,
  loadingTitle,
  children,
}: ScreenProps) {
  const frame = Frame.useFrame()
  layout ??= frame.mode === 'dialog' ? 'compact' : 'full'

  const screensTransition = useTransition(
    { children, loading, name, show: !loading },
    {
      config: {
        friction: 120,
        mass: 2,
        tension: 1400,
      },
      enter: {
        delay: 80,
        opacity: 1,
        transform: 'translate3d(0px, 0, 0)',
      },
      from: {
        opacity: 0,
        transform: 'translate3d(20px, 0, 0)',
      },
      initial: {
        opacity: 1,
        transform: 'translate3d(0px, 0, 0)',
      },
      keys: ({ loading, name }) => (loading ? 'loading' : (name ?? '')),
      leave: {
        config: {
          friction: 80,
          mass: 1,
          tension: 2000,
        },
        opacity: 0,
        transform: 'translate3d(-20px, 0, 0)',
      },
    },
  )

  const loaderTransition = useTransition(
    { loading: Boolean(loading), loadingTitle },
    {
      config: {
        friction: 80,
        mass: 1,
        tension: 2000,
      },
      enter: {
        delay: SHOW_LOADER_DELAY,
        opacity: 1,
        transform: 'scale3d(1, 1, 1)',
      },
      from: {
        opacity: 0,
        transform: 'scale3d(0.97, 0.97, 1)',
      },
      initial: {
        opacity: 1,
        transform: 'scale3d(1, 1, 1)',
      },
      keys: ({ loading }) => String(loading),
      leave: {
        opacity: 0,
        transform: 'scale3d(1, 1, 1)',
      },
    },
  )

  const screenRef = useRef<HTMLDivElement>(null)
  const screenSpring = useSpring({
    config: {
      friction: 80,
      mass: 1,
      tension: 2000,
    },
    from: {
      height: 0,
    },
  })

  const handleSreenRef = (el: HTMLDivElement) => {
    if (!el || screenRef.current === el) return

    screenSpring.height.start(el.clientHeight, {
      immediate: !screenRef.current,
    })

    // make sure the initial height doesnt
    // animate, even with double rendering
    queueMicrotask(() => {
      screenRef.current = el
    })
  }

  // refresh the height when changing from full.medium to full.large
  useEffect(() => {
    if (frame.mode === 'full' && frame.variant === 'large') {
      screenSpring.height.start(screenRef.current?.clientHeight ?? 0, {
        immediate: true,
      })
    }
  }, [frame, screenSpring.height.start])

  return (
    <div
      className={cx(
        css({
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%',
        }),
        layout === 'compact' &&
          css({
            overflow: 'hidden',
          }),
        layout === 'full' &&
          css({
            '@container (min-width: 480px)': {
              overflowY: 'hidden',
            },
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
          layout === 'full' && css({ padding: 24 }),
        )}
      >
        <a.div
          className={cx(
            css({
              flex: '1 1 auto',
              minHeight: 0,
              position: 'relative',
              width: '100%',
            }),
            layout === 'compact' &&
              css({
                height: 'var(--screen-height)',
              }),
            layout === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  height: 'var(--screen-height)',
                },
              }),
          )}
          style={
            {
              '--screen-height': screenSpring.height.to((v) => `${v}px`),
            } as CSSProperties
          }
        >
          {screensTransition(
            (styles, { show, children }) =>
              show && (
                <a.div
                  className={cx(
                    css({
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'absolute',
                      width: '100%',
                    }),
                    layout === 'compact' &&
                      css({
                        inset: '0 0 auto',
                      }),
                    layout === 'full' &&
                      css({
                        '@container (min-width: 480px)': {
                          inset: '0 0 auto',
                        },
                        inset: 0,
                      }),
                  )}
                  style={{
                    ...styles,
                    opacity: styles.opacity.to([0, 0.2, 1], [0, 0, 1]),
                  }}
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
                          paddingBottom: 24,
                        }),
                    )}
                    ref={handleSreenRef}
                  >
                    {children}
                  </div>
                </a.div>
              ),
          )}
        </a.div>
        {loaderTransition(
          (styles, { loading, loadingTitle }) =>
            loading && (
              <a.div
                className={cx(
                  css({
                    backgroundColor: 'var(--background-color-th_base)',
                    color: 'var(--text-color-th_base)',
                    display: 'grid',
                    inset: 0,
                    padding: 24,
                    position: 'absolute',
                    zIndex: 2,
                  }),
                )}
                style={styles}
              >
                {loadingTitle ?? 'Loading…'}
              </a.div>
            ),
        )}
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
