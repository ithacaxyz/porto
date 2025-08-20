import { a, useTransition } from '@react-spring/web'
import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { css, cx } from '~/../styled-system/css'
import { useSize } from '~/hooks/useSize.js'
import { LightDarkImage } from '~/LightDarkImage/LightDarkImage.js'
import LucideBadgeCheck from '~icons/lucide/badge-check'
import LucideX from '~icons/lucide/x'
import iconDefaultDark from './icon-default-dark.svg'
import iconDefaultLight from './icon-default-light.svg'

const FrameContext = createContext<Frame.Context | null>(null)

const springStyles = {
  from: {
    dialogOpacity: 0,
    dialogTransform: 'translate3d(0, 0px, 0) scale3d(0.92, 0.92, 1)',
    drawerTransform: 'translate3d(0, 100%, 0)',
    overlayOpacity: 0,
  },
  enter: {
    dialogOpacity: 1,
    // temporarily disable anims
    // dialogTransform: 'translate3d(0, 16px, 0) scale3d(1, 1, 1)',
    dialogTransform: 'translate3d(0, 0px, 0) scale3d(1, 1, 1)',
    drawerTransform: 'translate3d(0, 0%, 0)',
    overlayOpacity: 1,
  },
  leave: {
    dialogOpacity: 0,
    // temporarily disable anims
    // dialogTransform: 'translate3d(0, 32px, 0) scale3d(1, 1, 1)',
    dialogTransform: 'translate3d(0, 0px, 0) scale3d(1, 1, 1)',
    drawerTransform: 'translate3d(0, 100%, 0)',
    overlayOpacity: 0,
  },
} as const

export function Frame({
  children,
  colorScheme = 'light dark',
  mode: mode_,
  onClose,
  onClosed,
  onHeight,
  site,
  visible = true,
}: Frame.Props) {
  const frameRef = useRef<HTMLDivElement>(null)

  const mode = useMemo<Frame.Mode>(() => {
    if (typeof mode_ !== 'string') return mode_
    return { name: mode_, variant: 'auto' }
  }, [mode_])

  const [large, setLarge] = useState(false)
  useSize(frameRef, ({ width }) => setLarge(width >= 480))

  const containerRef = useRef<HTMLDivElement | null>(null)
  const screenRef = useRef<HTMLDivElement | null>(null)
  const currentScreenId = useRef<string>('')
  const [currentScreen, setCurrentScreen] = useState<HTMLDivElement | null>(
    null,
  )

  const dialogDrawer =
    mode.name === 'dialog' &&
    (mode.variant === 'drawer' || (mode.variant === 'auto' && !large))

  const dialogFloating =
    mode.name === 'dialog' &&
    (mode.variant === 'floating' || (mode.variant === 'auto' && large))

  const openTransition = useTransition(visible, {
    config: dialogDrawer
      ? { clamp: true, friction: 120, mass: 1, tension: 2000 }
      : { friction: 160, mass: 1.3, tension: 3000 },
    enter: () => async (next) => {
      await next({ ...springStyles.from, immediate: true })
      // temporarily disable anims
      // await next(springStyles.enter)
      await next({ ...springStyles.enter, immediate: true })
    },
    initial: springStyles.enter,
    leave: () => async (next) => {
      await next({
        ...springStyles.leave,
        // temporarily disable anims
        // immediate: mode.name === 'dialog' && !dialogDrawer,
        immediate: true,
      })
      onClosed?.()
    },
  })

  useSize(
    screenRef,
    ({ height }) => {
      if (height === 0) return
      if (mode.name === 'dialog')
        onHeight?.(
          height +
            33 + // 32px + 1px border for the frame bar in dialog mode
            2, // frame top & bottom borders
        )
    },
    [currentScreen, onHeight, mode],
  )

  const setScreen = useCallback((el: HTMLDivElement | null, id: string) => {
    if (el === null) {
      // only clear if this is the current screen
      if (id === currentScreenId.current) {
        screenRef.current = null
        setCurrentScreen(null)
      }
      return
    }
    screenRef.current = el
    setCurrentScreen(el)
    currentScreenId.current = id
  }, [])

  const contextValue = useMemo<Frame.Context>(() => {
    if (mode.name === 'dialog')
      return {
        colorScheme,
        mode: 'dialog',
        setScreen,
        variant:
          mode.variant === 'auto'
            ? dialogDrawer
              ? 'drawer'
              : 'floating'
            : mode.variant,
      }
    return {
      colorScheme,
      mode: 'full',
      setScreen,
      variant:
        mode.variant === 'auto' ? (large ? 'large' : 'medium') : mode.variant,
    }
  }, [colorScheme, large, mode, setScreen, mode.variant, dialogDrawer])

  useEffect(() => {
    if (!onClose) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <FrameContext.Provider value={contextValue}>
      <div
        className={cx(
          css({
            containerType: 'inline-size',
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            width: '100%',
          }),
          css({
            height: '100%',
          }),
          dialogDrawer &&
            css({
              alignItems: 'flex-end',
            }),
        )}
        data-dialog={mode.name === 'dialog' ? true : undefined}
        ref={frameRef}
        style={{ colorScheme }}
      >
        {openTransition(
          (styles, visible) =>
            visible && (
              <a.div
                className={cx(
                  css({
                    display: 'grid',
                    overflowX: 'auto',
                    overflowY: mode.name === 'full' ? 'auto' : 'hidden',
                    width: '100%',
                  }),
                  dialogDrawer
                    ? css({ placeItems: 'end center' })
                    : css({ placeItems: 'start center' }),
                  css({
                    height: '100%',
                  }),
                )}
              >
                {(dialogDrawer || dialogFloating) && (
                  <a.div
                    className={css({
                      background: 'rgba(0, 0, 0, 0.5)',
                      inset: 0,
                      position: 'fixed',
                    })}
                    onClick={onClose}
                    style={{
                      opacity: styles.overlayOpacity,
                    }}
                  />
                )}
                <a.div
                  className={cx(
                    css({
                      display: 'flex',
                      flex: 1,
                      flexDirection: 'column',
                      minWidth: 360,
                      position: 'relative',
                      width: '100%',
                    }),
                    mode.name === 'dialog' &&
                      css({
                        backgroundColor: 'var(--background-color-th_base)',
                        border: '1px solid var(--border-color-th_frame)',
                        borderRadius: 'var(--radius-th_frame)',
                        flex: 1,
                        overflow: 'hidden',
                      }),
                    dialogDrawer &&
                      css({
                        borderBottomRadius: 0,
                        maxWidth: 460,
                      }),
                    dialogFloating && css({ maxWidth: 400 }),
                    mode.name === 'full' &&
                      css({
                        '@container (min-width: 480px)': {
                          backgroundColor:
                            'var(--background-color-th_base-plane)',
                        },
                        backgroundColor: 'var(--background-color-th_base)',
                        height: '100%',
                      }),
                  )}
                  style={
                    dialogDrawer
                      ? {
                          transform: styles.drawerTransform,
                        }
                      : dialogFloating
                        ? {
                            opacity: styles.dialogOpacity,
                            transform: styles.dialogTransform,
                          }
                        : {}
                  }
                >
                  <FrameBar mode={mode} onClose={onClose} site={site} />
                  <div
                    className={cx(
                      css({
                        display: 'flex',
                        flex: '1 0 auto',
                        justifyContent: 'center',
                        width: '100%',
                      }),
                      mode.name === 'full' &&
                        css({
                          '@container (min-width: 480px)': {
                            alignItems: 'center',
                            paddingBottom: 60,
                          },
                        }),
                    )}
                  >
                    <div
                      className={cx(
                        css({
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          width: '100%',
                        }),
                        mode.name === 'full' &&
                          css({
                            '@container (min-width: 480px)': {
                              backgroundColor:
                                'var(--background-color-th_base)',
                              border: '1px solid var(--border-color-th_frame)',
                              borderRadius: 'var(--radius-th_large)',
                              maxWidth: 400,
                              overflow: 'hidden',
                            },
                            overflow: 'hidden',
                          }),
                      )}
                      ref={containerRef}
                    >
                      <div
                        className={cx(
                          css({
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                          }),
                          mode.name === 'dialog' && css({}),
                          mode.name === 'full' &&
                            css({
                              '@container (min-width: 480px)': {},
                              height: '100%',
                            }),
                        )}
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                </a.div>
              </a.div>
            ),
        )}
      </div>
    </FrameContext.Provider>
  )
}

function FrameBar({
  mode,
  onClose,
  site,
}: {
  mode: Frame.Mode
  onClose?: (() => void) | null
  site: Frame.Site
}) {
  const icon =
    typeof site.icon === 'string'
      ? ([site.icon, site.icon] as const)
      : (site.icon ?? [iconDefaultLight, iconDefaultDark])

  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          color: 'var(--text-color-th_frame)',
          display: 'flex',
          flex: '0 0 auto',
          justifyContent: 'space-between',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          width: '100%',
        }),
        mode.name === 'dialog' &&
          css({
            backgroundColor: 'var(--background-color-th_frame)',
            borderBottom: '1px solid var(--border-color-th_frame)',
            height: 33, // 32 + 1px border
          }),
        mode.name === 'full' &&
          css({
            '@container (min-width: 480px)': {
              borderBottom: 'none',
              height: 60,
            },
            borderBottom: '1px solid var(--border-color-th_frame)',
            height: 48,
          }),
      )}
    >
      <div
        className={cx(
          css({
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            minWidth: 0,
          }),
          mode.name === 'dialog' &&
            css({
              paddingInline: 12,
            }),
          mode.name === 'full' &&
            css({
              '@container (min-width: 480px)': {
                paddingInline: 20,
              },
              paddingInline: 12,
            }),
        )}
      >
        <div
          className={cx(
            css({
              '--icon-radius': 'var(--radius-th_small)',
              '--icon-size': '20px',
              alignItems: 'center',
              display: 'flex',
              flexShrink: 0,
              fontSize: 13,
              gap: 8,
            }),
            mode.name === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  '--icon-radius': 'var(--radius-th_medium)',
                  '--icon-size': '28px',
                  fontSize: 15,
                },
              }),
          )}
        >
          <div
            className={css({
              borderRadius: 'var(--icon-radius)',
              height: 'var(--icon-size)',
              overflow: 'hidden',
              width: 'var(--icon-size)',
            })}
          >
            <LightDarkImage
              dark={icon[1]}
              height={28}
              light={icon[0]}
              width={28}
            />
          </div>
          <div>
            <div hidden={mode.name === 'full'}>{site.label}</div>
            <div hidden={mode.name === 'dialog'}>
              {site.labelExtended ?? site.label}
            </div>
          </div>
          {site.verified && (
            <div
              className={css({
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              })}
            >
              <LucideBadgeCheck
                className={css({
                  color: 'var(--color-th_accent)',
                  height: 16,
                  width: 16,
                })}
              />
            </div>
          )}
          {site.tag && (
            <div
              className={css({
                alignItems: 'center',
                backgroundColor: 'var(--background-color-th_badge)',
                borderRadius: 10,
                color: 'var(--text-color-th_badge)',
                display: 'flex',
                fontSize: 11,
                height: 20,
                paddingInline: 5,
              })}
            >
              {site.tag}
            </div>
          )}
        </div>
      </div>
      {onClose && (
        <button
          className={cx(
            css({
              _active: {
                transform: 'translateY(1px)',
              },
              _focusVisible: {
                outline: '2px solid var(--color-th_focus)',
                outlineOffset: -2,
              },
              '@container (min-width: 480px)': {
                padding: '0 20px',
              },
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer!',
              display: 'flex',
              height: '100%',
              padding: '0 12px',
            }),
            mode.name === 'dialog' &&
              css({
                borderTopRightRadius: 'var(--radius-th_frame)',
                height: '100%',
                paddingInline: '6px 12px',
              }),
          )}
          onClick={onClose}
          title="Close Dialog"
          type="button"
        >
          <LucideX
            className={css({
              color: 'var(--color-th_frame)',
              height: 18,
              width: 18,
            })}
          />
        </button>
      )}
    </div>
  )
}

export namespace Frame {
  export interface Props {
    children?: ReactNode
    colorScheme?: 'light' | 'dark' | 'light dark' | undefined
    loading?: boolean | undefined
    loadingText?: string | undefined
    mode: Mode | ModeName
    onClose?: (() => void) | undefined
    onClosed?: (() => void) | undefined
    onHeight?: ((height: number) => void) | undefined
    site: Site
    screenKey?: string | undefined
    visible?: boolean | undefined
  }

  export type Mode =
    | {
        name: 'dialog'
        variant:
          | 'auto' // drawer or floating based on width (used in iframe mode)
          | 'drawer' // (used in iframe mode)
          | 'floating' // with overlay & animations (used in iframe mode)
      }
    | {
        name: 'full'
        variant:
          | 'auto' // large or medium, based on width (used in popup mode)
          | 'large' // large new tab (480px+)
          | 'medium' // medium new tab (less than 480px)
      }

  export type ModeName = Mode['name']

  export type Site = {
    icon?: string | [light: string, dark: string] | undefined
    label: ReactNode | undefined
    labelExtended?: ReactNode | undefined
    tag?: ReactNode | undefined
    verified?: boolean | undefined
  }

  export type Context = {
    colorScheme: 'light' | 'dark' | 'light dark'
    setScreen: (element: HTMLDivElement | null, id: string) => void
  } & (
    | {
        mode: 'dialog'
        variant: 'drawer' | 'floating'
      }
    | {
        mode: 'full'
        variant: 'large' | 'medium'
      }
  )

  export function useFrame(optional: true): Frame.Context | null
  export function useFrame(optional?: false): Frame.Context
  export function useFrame(optional?: boolean): Frame.Context | null {
    const context = useContext(FrameContext)
    if (!context && !optional)
      throw new Error('useFrame must be used within a Frame context')
    return context
  }
}
