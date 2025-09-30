import type { ReactNode } from 'react'
import {
  createContext,
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
  visible = true,
}: Frame.Props) {
  const frameRef = useRef<HTMLDivElement>(null)

  const [large, setLarge] = useState(false)
  useSize(frameRef, ({ width }) => setLarge(width >= 480))

  const mode = useMemo<Frame.ModeResolved>(() => {
    const mode: Frame.Mode =
      typeof mode_ === 'string'
        ? { name: mode_, variant: 'auto' as const }
        : { ...mode_ }

    if (mode.name === 'dialog' && mode.variant === 'auto')
      return { name: 'dialog', variant: large ? 'floating' : 'drawer' }

    if (mode.name === 'full' && mode.variant === 'auto')
      return { name: 'full', variant: large ? 'large' : 'medium' }

    if (mode.variant === 'auto')
      throw new Error('Failed to resolve frame mode variant')

    return mode as Frame.ModeResolved
  }, [mode_, large])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const screenRef = useRef<HTMLDivElement | null>(null)

  useSize(
    screenRef,
    ({ width, height }) => {
      if (height === 0 || width === 0) return
      if (mode.name === 'dialog')
        onHeight?.(
          height +
            33 + // 32px + 1px border for the frame bar in dialog mode
            2, // frame top & bottom borders
        )
      if (mode.name === 'full' && mode.variant === 'content-height')
        onHeight?.(
          height +
            (width >= 480 ? 60 : width >= 380 ? 48 : 40) + // frame bar height
            2, // frame top & bottom borders
        )
    },
    [onHeight, mode],
  )

  const contextValue = useMemo<Frame.Context>(() => {
    if (mode.name === 'full')
      return { colorScheme, mode: 'full', variant: mode.variant }
    if (mode.name === 'dialog')
      return { colorScheme, mode: 'dialog', variant: mode.variant }
    throw new Error('Failed to resolve frame context value')
  }, [colorScheme, mode])

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
            height: '100%',
            placeItems: 'center',
            position: 'relative',
            width: '100%',
          }),
          mode.name === 'dialog' &&
            mode.variant === 'drawer' &&
            css({
              alignItems: 'flex-end',
            }),
        )}
        data-dialog={mode.name === 'dialog' ? true : undefined}
        ref={frameRef}
        style={{
          colorScheme,
          display: visible ? undefined : 'none',
        }}
      >
        <div
          className={cx(
            css({
              display: 'grid',
              height: '100%',
              overflowX: 'auto',
              overflowY:
                mode.name === 'dialog' ||
                (mode.name === 'full' && mode.variant !== 'content-height')
                  ? 'auto'
                  : 'hidden',
              width: '100%',
            }),
            mode.name === 'dialog' && mode.variant === 'drawer'
              ? css({ placeItems: 'end center' })
              : css({ placeItems: 'start center' }),
          )}
        >
          {mode.name === 'dialog' && (
            // biome-ignore lint/a11y/noStaticElementInteractions: this is an optional way to close the dialog with a pointer
            <div
              className={css({
                background: 'rgba(0, 0, 0, 0.5)',
                inset: 0,
                position: 'fixed',
              })}
              onClick={onClose}
            />
          )}
          <div
            className={cx(
              css({
                display: 'flex',
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
              mode.name === 'dialog' &&
                mode.variant === 'drawer' &&
                css({
                  borderBottom: 0,
                  borderBottomRadius: 0,
                  maxWidth: 460,
                }),
              mode.name === 'dialog' &&
                mode.variant === 'floating' &&
                css({
                  maxWidth: 360,
                  top: 16,
                }),
              mode.name === 'full' &&
                css({
                  '@container (min-width: 480px)': {
                    backgroundColor: 'var(--background-color-th_base-plane)',
                  },
                  backgroundColor: 'var(--background-color-th_base)',
                }),
              mode.name === 'full' &&
                mode.variant !== 'content-height' &&
                css({
                  height: '100%',
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
                        backgroundColor: 'var(--background-color-th_base)',
                        border: '1px solid var(--border-color-th_frame)',
                        borderRadius: 'var(--radius-th_large)',
                        maxWidth: 400,
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
                    mode.name === 'full' &&
                      mode.variant !== 'content-height' &&
                      css({
                        height: '100%',
                      }),
                  )}
                  ref={screenRef}
                >
                  {children}
                </div>
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
          borderBottom: '1px solid var(--border-color-th_frame)',
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
            height: 33, // 32 + 1px border
          }),
        mode.name === 'full' &&
          css({
            '@container (min-width: 380px)': {
              height: 48,
            },
            '@container (min-width: 480px)': {
              borderBottom: 'none',
              height: 60,
            },
            height: 40,
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
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer!',
              display: 'flex',
              height: '100%',
              padding: '0 12px',
            }),
            mode.name === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  padding: '0 20px',
                },
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
    mode: Mode | ModeName
    onClose?: (() => void) | undefined
    onHeight?: ((height: number) => void) | undefined
    site: Site
    screenKey?: string | undefined
    visible?: boolean | undefined
  }

  export type Site = {
    icon?: string | [light: string, dark: string] | undefined
    label: ReactNode | undefined
    labelExtended?: ReactNode | undefined
    tag?: ReactNode | undefined
    verified?: boolean | undefined
  }

  type ModeDialog = {
    name: 'dialog'
    variant:
      | 'auto' // drawer or floating based on width (used in iframe mode)
      | 'drawer' // (used in iframe mode)
      | 'floating' // with overlay & animations (used in iframe mode)
  }

  type ModeFull = {
    name: 'full'
    variant:
      | 'auto' // large or medium, based on width
      | 'large' // large new tab (480px+)
      | 'medium' // medium new tab (less than 480px)
      | 'content-height' // similar to medium, but height is based on content
  }

  export type Mode = ModeDialog | ModeFull
  export type ModeName = Mode['name']

  export type ModeResolved =
    | { name: 'dialog'; variant: Exclude<ModeDialog['variant'], 'auto'> }
    | { name: 'full'; variant: Exclude<ModeFull['variant'], 'auto'> }

  export type Context = {
    colorScheme: 'light' | 'dark' | 'light dark'
  } & (
    | {
        mode: 'dialog'
        variant: Extract<ModeResolved, { name: 'dialog' }>['variant']
      }
    | {
        mode: 'full'
        variant: Extract<ModeResolved, { name: 'full' }>['variant']
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
