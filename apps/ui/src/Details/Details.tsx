import { type ReactNode, useState } from 'react'
import LucideInfo from '~icons/lucide/info'
import { css } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'

export function Details({
  children,
  loading,
  opened: forceOpened,
}: Details.Props) {
  const [opened_, setOpened] = useState(forceOpened || false)
  const opened = forceOpened ? true : opened_

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

  return (
    <div
      className={css({
        backgroundColor: 'var(--background-color-th_base-alt)',
        borderRadius: 'var(--radius-th_medium)',
        fontSize: 13,
        position: 'relative',
      })}
    >
      {opened ? (
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            gap: 6,
            justifyContent: 'space-between',
            paddingInline: 12,
            width: '100%',
          })}
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
        </div>
      ) : (
        <ButtonArea
          className={css({
            alignItems: 'center',
            backgroundColor: 'var(--background-color-th_base-alt)',
            borderRadius: 'var(--radius-th_medium)',
            color: 'var(--text-color-th_base-secondary)',
            display: 'flex',
            gap: 6,
            height: 34,
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
      )}
    </div>
  )
}

export namespace Details {
  export type Props = {
    children: ReactNode
    loading?: boolean | ReactNode
    opened?: boolean | undefined
  }

  export function Item({ label, value }: Item.Props) {
    return (
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          fontSize: 14,
          height: 18,
          justifyContent: 'space-between',
        })}
      >
        <div
          className={css({
            color: 'var(--text-color-th_base-secondary)',
          })}
        >
          {label}
        </div>
        <div
          className={css({
            fontWeight: 500,
          })}
        >
          {value}
        </div>
      </div>
    )
  }

  export namespace Item {
    export type Props = {
      label: ReactNode
      value: ReactNode
    }
  }
}
