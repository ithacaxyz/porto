import { a, useSpring, useTransition } from '@react-spring/web'
import { Children, type ReactNode, useState } from 'react'
import LucideInfo from '~icons/lucide/info'
import { css } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'

export function Details({ children, loading }: Details.Props) {
  const [opened, setOpened] = useState(false)

  if (loading)
    children = (
      <div
        className={css({
          alignItems: 'center',
          color: 'var(--text-color-th_base-secondary)',
          display: 'flex',
          fontSize: 14,
          height: 18,
          justifyContent: 'center',
        })}
      >
        {loading === true ? 'Loading details…' : loading}
      </div>
    )

  const rows = Children.count(children)
  const expandedHeight =
    rows * 18 + // row height
    (rows - 1) * 6 + // row gap
    16 // vertical padding

  const { height } = useSpring({
    config: {
      friction: 60,
      tension: 1200,
    },
    height: opened ? expandedHeight : 34,
  })

  const openTransition = useTransition(
    { loading, opened },
    {
      config: {
        friction: 40,
        tension: 500,
      },
      enter: { opacity: 1, transform: 'scale(1)' },
      from: { opacity: 0, transform: 'scale(0.95)' },
      initial: { opacity: 1, transform: 'scale(1)' },
      keys: (item) => (item.opened ? `o-${item.loading}` : 'c'),
      leave: { display: 'none', immediate: true },
    },
  )

  return (
    <a.div
      className={css({
        backgroundColor: 'var(--background-color-th_base-alt)',
        borderRadius: 'var(--radius-th_medium)',
        fontSize: 13,
        position: 'relative',
      })}
      style={{ height }}
    >
      <div
        className={css({
          borderRadius: 'var(--radius-th_medium)',
          height: '100%',
        })}
      >
        {openTransition((style, { opened }) =>
          opened ? (
            <a.div
              className={css({
                alignItems: 'center',
                display: 'flex',
                gap: 6,
                justifyContent: 'space-between',
                paddingInline: 12,
                width: '100%',
              })}
              style={style}
            >
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  paddingBlock: 8,
                  width: '100%',
                })}
              >
                {children}
              </div>
            </a.div>
          ) : (
            <a.div
              className={css({
                display: 'flex',
                height: '100%',
              })}
              style={style}
            >
              <ButtonArea
                className={css({
                  alignItems: 'center',
                  backgroundColor: 'var(--background-color-th_base-alt)',
                  borderRadius: 'var(--radius-th_medium)',
                  color: 'var(--text-color-th_base-secondary)',
                  display: 'flex',
                  gap: 6,
                  height: '100%',
                  justifyContent: 'center',
                  width: '100%',
                })}
                onClick={() => setOpened(true)}
              >
                <LucideInfo
                  className={css({
                    height: 16,
                    width: 16,
                  })}
                />
                <span>Show more details</span>
              </ButtonArea>
            </a.div>
          ),
        )}
      </div>
    </a.div>
  )
}

export namespace Details {
  export type Props = {
    children: ReactNode
    loading?: boolean | ReactNode
  }
}
