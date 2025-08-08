import type { ReactNode } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import LucideX from '~icons/lucide/x'
import { css, cx } from '../../styled-system/css'
import { useSize } from '../hooks/useSize.js'

export interface FrameProps {
  children?: ReactNode
  colorScheme?: 'light' | 'dark' | 'light dark'
  mode: FrameMode
  onClose?: (() => void) | null
  site: Site
}

type Site = {
  icon?: string
  label: ReactNode
  labelExtended?: ReactNode
}

export type FrameMode =
  | 'dialog'
  | 'full'
  | { mode: 'dialog'; variant?: 'normal' | 'drawer' }
  | { mode: 'full'; variant?: 'medium' | 'large' }

type FrameContext =
  | { mode: 'dialog'; variant: 'normal' | 'drawer' }
  | { mode: 'full'; variant: 'medium' | 'large' }

const FrameContext = createContext<FrameContext>({
  mode: 'full',
  variant: 'medium',
})

// TODO: remove
export function useFrameMode() {
  return useContext(FrameContext).mode
}
export function useFrame() {
  return useContext(FrameContext)
}

export function Frame({
  children,
  colorScheme,
  mode: mode_,
  onClose,
  site,
}: FrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)

  const { mode, variant } =
    typeof mode_ === 'string' ? { mode: mode_, variant: undefined } : mode_

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

  const contextValue = useMemo<FrameContext>(() => {
    if (mode === 'dialog')
      return {
        mode: 'dialog',
        variant: variant || 'normal',
      }
    return {
      mode: 'full',
      variant: variant || fullVariantAuto,
    }
  }, [mode, variant, fullVariantAuto])

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
                minHeight: 100,
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
              className={cx(
                css({
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }),
                mode === 'full' &&
                  css({
                    '@container (min-width: 480px)': {
                      backgroundColor: 'var(--background-color-th_base)',
                      border: '1px solid var(--border-color-th_frame)',
                      borderRadius: 'var(--radius-th_large)',
                      maxWidth: 400,
                      overflow: 'hidden',
                    },
                  }),
              )}
            >
              {children}
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
  mode: 'dialog' | 'full'
  onClose?: (() => void) | null
  site: Site
}) {
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          color: 'var(--text-color-th_frame)',
          display: 'flex',
          flex: '0 0 auto',
          justifyContent: 'space-between',
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
          <div>
            {typeof site.icon === 'string' ? (
              <img
                alt=""
                className={css({
                  borderRadius: 'var(--icon-radius)',
                  height: 'var(--icon-size)',
                  width: 'var(--icon-size)',
                })}
                height={28}
                src={site.icon}
                width={28}
              />
            ) : (
              site.icon
            )}
          </div>
          <div>
            <div hidden={mode === 'full'}>{site.label}</div>
            <div hidden={mode === 'dialog'}>
              {site.labelExtended ?? site.label}
            </div>
          </div>
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
  mode: 'dialog' | 'full'
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

Frame.useMode = useFrameMode
Frame.useFrame = useFrame
