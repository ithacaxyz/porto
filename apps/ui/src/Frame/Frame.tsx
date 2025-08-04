import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import LucideX from '~icons/lucide/x'
import { css, cx } from '../../styled-system/css'

type Site = {
  icon?: string
  label: ReactNode
  labelExtended?: ReactNode
}

export type FrameMode = 'dialog' | 'full'

export interface FrameProps {
  children?: ReactNode
  mode: FrameMode
  site: Site
}

const FrameContext = createContext<{
  mode: FrameMode
}>({
  mode: 'full',
})

export function useFrameMode() {
  return useContext(FrameContext).mode
}

export function Frame({ children, mode, site }: FrameProps) {
  return (
    <FrameContext.Provider value={{ mode }}>
      <div
        className={css({
          containerType: 'inline-size',
          display: 'flex',
          height: '100%',
          minHeight: 200,
          width: '100%',
        })}
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
            mode === 'full' &&
              css({
                '@container (min-width: 480px)': {
                  backgroundColor: 'var(--background-color-th_base-plane)',
                },
                backgroundColor: 'var(--background-color-th_base)',
              }),
          )}
        >
          <FrameBar mode={mode} site={site} />
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

function FrameBar({ site, mode }: { site: Site; mode: FrameMode }) {
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          color: 'var(--text-color-th_frame)',
          display: 'flex',
          flex: '0 0 auto',
          height: 33, // 32 + 1px border
          justifyContent: 'space-between',
          width: '100%',
        }),
        mode === 'dialog' &&
          css({
            backgroundColor: 'var(--background-color-th_frame)',
            borderBottom: '1px solid var(--border-color-th_frame)',
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
      {mode === 'dialog' && <CloseButton />}
    </div>
  )
}

function CloseButton() {
  return (
    <button
      className={css({
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
        borderTopRightRadius: 'var(--radius-th_frame)',
        cursor: 'pointer!',
        display: 'flex',
        height: '100%',
        padding: 0,
        paddingInline: '6px 12px',
      })}
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
