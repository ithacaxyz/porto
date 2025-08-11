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

export function Frame({
  children,
  colorScheme = 'light dark',
  mode: mode_,
  onClose,
  onHeight,
  site,
}: Frame.Props) {
  const frameRef = useRef<HTMLDivElement>(null)

  const { mode, variant } =
    typeof mode_ === 'string' ? { mode: mode_, variant: undefined } : mode_

  // variant for the full mode, used when variant is not specified
  const [fullVariantAuto, setFullVariantAuto] = useState<'medium' | 'large'>(
    'medium',
  )

  useSize(
    frameRef,
    ({ width }) => {
      if (mode === 'dialog' || variant) return
      if (width < 480 && fullVariantAuto !== 'medium') {
        setFullVariantAuto('medium')
        return
      }
      if (width >= 480 && fullVariantAuto !== 'large') {
        setFullVariantAuto('large')
        return
      }
    },
    [mode, variant, fullVariantAuto],
  )

  const containerRef = useRef<HTMLDivElement | null>(null)
  const screenRef = useRef<HTMLDivElement | null>(null)
  const hasReceivedInitialScreenHeight = useRef(false)
  const currentScreenId = useRef<string>('')
  const [currentScreen, setCurrentScreen] = useState<HTMLDivElement | null>(
    null,
  )

  const lastScreenHeight = useRef<number | null>(null)

  useSize(
    screenRef,
    ({ height }) => {
      if (containerRef.current && height > 0) {
        containerRef.current.style.setProperty('--screen-height', `${height}px`)
      }

      if (mode === 'dialog') onHeight?.(height + 33)

      lastScreenHeight.current = height
      hasReceivedInitialScreenHeight.current = true
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

    if (currentScreenId.current !== id)
      hasReceivedInitialScreenHeight.current = false

    screenRef.current = el
    setCurrentScreen(el)
    currentScreenId.current = id
  }, [])

  const contextValue = useMemo<Frame.Context>(() => {
    if (mode === 'dialog')
      return {
        colorScheme,
        mode: 'dialog',
        setScreen,
        variant: variant || 'normal',
      }
    return {
      colorScheme,
      mode: 'full',
      setScreen,
      variant: variant || fullVariantAuto,
    }
  }, [colorScheme, fullVariantAuto, mode, variant, setScreen])

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
            display: 'flex',
          }),
          mode === 'dialog' && variant === 'drawer'
            ? css({
                inset: 'auto 0 0',
                position: 'absolute',
              })
            : css({
                height: '100%',
                width: '100%',
              }),
        )}
        ref={frameRef}
        style={{ colorScheme }}
      >
        <div
          className={cx(
            css({
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              width: '100%',
            }),
            mode === 'dialog' &&
              css({
                backgroundColor: 'var(--background-color-th_base)',
                border: '1px solid var(--border-color-th_frame)',
                borderRadius: 'var(--radius-th_frame)',
                overflow: 'hidden',
              }),
            contextValue.mode === 'dialog' &&
              contextValue.variant === 'drawer' &&
              css({
                borderBottomRadius: 0,
              }),
            mode === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  backgroundColor: 'var(--background-color-th_base-plane)',
                },
                backgroundColor: 'var(--background-color-th_base)',
              }),
          )}
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
              mode === 'full' &&
                css({
                  '@container (min-width: 480px)': {
                    alignItems: 'center',
                    paddingBottom: 60,
                  },
                }),
            )}
          >
            <div
              ref={containerRef}
              className={cx(
                css({
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  width: '100%',
                }),
                mode === 'full' &&
                  css({
                    '@container (min-width: 480px)': {
                      backgroundColor: 'var(--background-color-th_base)',
                      border: '1px solid var(--border-color-th_frame)',
                      borderRadius: 'var(--radius-th_large)',
                      height: 'var(--screen-height)',
                      maxWidth: 400,
                      overflow: 'hidden',
                    },
                    overflow: 'hidden',
                  }),
                mode === 'dialog' &&
                  css({
                    height: 'var(--screen-height)',
                    minHeight: 200,
                  }),
              )}
            >
              <div
                className={cx(
                  css({
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    width: '100%',
                  }),
                  mode === 'dialog' &&
                    css({
                      inset: '0 0 auto',
                    }),
                  mode === 'full' &&
                    css({
                      '@container (min-width: 480px)': {
                        inset: '0 0 auto',
                      },
                      inset: 0,
                    }),
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
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
        mode === 'dialog' &&
          css({
            backgroundColor: 'var(--background-color-th_frame)',
            borderBottom: '1px solid var(--border-color-th_frame)',
            height: 33, // 32 + 1px border
          }),
        mode === 'full' &&
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
            paddingInline: 12,
            verticalAlign: 'middle',
          }),
          mode === 'full' &&
            css({
              paddingInline: 20,
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
            mode === 'full' &&
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
            <div hidden={mode === 'full'}>{site.label}</div>
            <div hidden={mode === 'dialog'}>
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
      {onClose && <CloseButton mode={mode} onClick={onClose} />}
    </div>
  )
}

function CloseButton({
  mode,
  onClick,
}: {
  mode: Frame.Mode
  onClick?: () => void
}) {
  return (
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
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer!',
          display: 'flex',
          height: '100%',
          padding: '0 12px',
        }),
        mode === 'dialog' &&
          css({
            borderTopRightRadius: 'var(--radius-th_frame)',
            height: '100%',
            paddingInline: '6px 12px',
          }),
      )}
      onClick={onClick}
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
  )
}

export namespace Frame {
  export interface Props {
    children?: ReactNode
    colorScheme?: 'light' | 'dark' | 'light dark'
    loading?: boolean
    loadingText?: string
    mode: Frame.ModeWithVariant
    onClose?: (() => void) | null
    onHeight?: (height: number) => void
    site: Site
    screenKey?: string
  }

  export type Mode = 'dialog' | 'full'

  export type ModeWithVariant =
    | Frame.Mode
    | { mode: 'dialog'; variant?: 'normal' | 'drawer' }
    | { mode: 'full'; variant?: 'medium' | 'large' }

  export type Site = {
    icon?: string | [light: string, dark: string]
    label: ReactNode
    labelExtended?: ReactNode
    tag?: ReactNode
    verified?: boolean
  }

  export type Context = {
    colorScheme: 'light' | 'dark' | 'light dark'
    setScreen: (element: HTMLDivElement | null, id: string) => void
  } & (
    | { mode: 'dialog'; variant: 'normal' | 'drawer' }
    | { mode: 'full'; variant: 'medium' | 'large' }
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
