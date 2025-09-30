import { Cuer } from 'cuer'
import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { CopyButton } from '../CopyButton/CopyButton.js'

export function Deposit({
  address,
  className,
  label = 'Deposit crypto',
}: Deposit.Props) {
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          backgroundColor: 'var(--background-color-th_base-alt)',
          borderRadius: 'var(--radius-th_medium)',
          display: 'flex',
          height: 60,
          justifyContent: 'space-between',
          padding: 8,
          width: '100%',
        }),
        className,
      )}
    >
      <div
        className={css({
          display: 'flex',
          gap: 8,
        })}
      >
        <div
          className={css({
            height: 48,
            width: 48,
          })}
        >
          <Cuer.Root value={address}>
            <Cuer.Cells />
            <Cuer.Finder radius={1} />
          </Cuer.Root>
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          })}
        >
          <div
            className={css({
              color: 'var(--text-color-th_base)',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'left',
            })}
          >
            {label}
          </div>
          <div
            className={css({
              color: 'var(--text-color-th_base-secondary)',
              fontFamily: 'monospace',
              fontSize: 10,
              fontWeight: 400,
              lineHeight: '14px',
              maxWidth: '21ch',
              minWidth: '21ch',
              wordBreak: 'break-all',
            })}
          >
            {address}
          </div>
        </div>
      </div>
      <CopyButton size="medium" value={address} variant="distinct" />
    </div>
  )
}

export namespace Deposit {
  export interface Props {
    address: string
    className?: string
    label?: ReactNode
  }
}
