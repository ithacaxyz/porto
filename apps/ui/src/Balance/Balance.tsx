import { a, useTransition } from '@react-spring/web'
import { Chains } from 'porto'
import { css, cx } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'
import { ChainIcon } from '../ChainIcon/ChainIcon.js'
import { Spinner } from '../Spinner/Spinner.js'
import { TokenIcon } from '../TokenIcon/TokenIcon.js'

export function Balance({
  amount,
  chainId,
  className,
  loading = false,
  onRefetch,
  amountFiat,
  tokenSymbol,
  tokenName,
  warn = false,
}: Balance.Props) {
  const chain = Chains.all.find((c) => c.id === chainId)
  const transition = useTransition(loading, {
    config: { friction: 70, tension: 1300 },
    enter: { opacity: 1, transform: 'scale(1)' },
    from: { opacity: 0, transform: 'scale(0.7)' },
    initial: { opacity: 1, transform: 'scale(1)' },
    leave: { immediate: true, display: 'none' },
  })
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          backgroundColor: 'var(--background-color-th_field)',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 'var(--radius-th_medium)',
          display: 'flex',
          gap: 8,
          height: 54,
          paddingLeft: 12,
        }),
        className,
      )}
    >
      <div
        className={css({
          flexShrink: 0,
        })}
      >
        <TokenIcon border size={24} symbol={tokenSymbol} />
      </div>
      <div
        className={css({
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          paddingBlock: 8,
          minWidth: 0,
        })}
      >
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          })}
        >
          <div
            className={css({
              color: 'var(--text-color-th_base)',
              fontSize: 14,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            })}
            title={tokenName}
          >
            {tokenName}
          </div>
        </div>
        <div
          className={css({
            alignItems: 'center',
            color: 'var(--text-color-th_base-secondary)',
            display: 'flex',
            fontSize: 12,
            gap: 4,
          })}
        >
          <div
            className={css({
              fontWeight: 400,
            })}
          >
            on
          </div>
          <ChainIcon border chainId={chainId} size="small" />
          <div
            className={css({
              fontWeight: 500,
            })}
          >
            {chain?.name || `Chain ${chainId}`}
          </div>
        </div>
      </div>
      <ButtonArea
        className={css({
          alignItems: 'flex-end',
          borderRadius: 'var(--radius-th_medium)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          marginLeft: 'auto',
          outlineOffset: -1,
          paddingBlock: 8,
          paddingInline: 12,
          minWidth: 0,
          flexShrink: 0,
          maxWidth: '50%',
          overflow: 'hidden',
        })}
        disabled={!onRefetch}
        onClick={onRefetch}
      >
        {transition((style, isLoading) =>
          isLoading ? (
            <a.div
              style={style}
              className={css({
                alignItems: 'center',
                display: 'flex',
                gap: 6,
                height: '100%',
                justifyContent: 'center',
                fontSize: 14,
                color: 'var(--text-color-th_base-secondary)',
              })}
              title="Fetching balance…"
            >
              <Spinner size={22} thickness={3} />
            </a.div>
          ) : (
            <a.div
              style={style}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '100%',
                width: '100%',
                minWidth: 0,
              })}
            >
              <div
                className={cx(
                  css({
                    fontSize: 14,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'right',
                  }),
                  warn
                    ? css({ color: 'var(--text-color-th_base-warning)' })
                    : css({ color: 'var(--text-color-th_base)' }),
                )}
                title={amountFiat}
              >
                {amountFiat}
              </div>
              <div
                className={css({
                  color: 'var(--text-color-th_base-secondary)',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  textAlign: 'right',
                })}
                title={amount}
              >
                {amount}
              </div>
            </a.div>
          ),
        )}
      </ButtonArea>
    </div>
  )
}

export namespace Balance {
  export interface Props {
    amount: string
    chainId: number
    className?: string
    loading?: boolean
    onRefetch?: () => void
    amountFiat: string
    tokenSymbol: string
    tokenName: string
    warn?: boolean
  }
}
