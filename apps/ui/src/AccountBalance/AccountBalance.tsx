import { Chains } from 'porto'
import { css, cx } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'
import { ChainIcon } from '../ChainIcon/ChainIcon.js'
import { Spinner } from '../Spinner/Spinner.js'
import { TokenIcon } from '../TokenIcon/TokenIcon.js'

export function AccountBalance({
  amount,
  chainId,
  className,
  loading = false,
  onRefetch,
  amountFiat,
  tokenSymbol,
  tokenName,
}: AccountBalance.Props) {
  const chain = Chains.all.find((c) => c.id === chainId)
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
            })}
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
          outlineOffset: 0,
          paddingBlock: 8,
          paddingInline: 12,
        })}
        disabled={!onRefetch}
        onClick={onRefetch}
      >
        {loading ? (
          <div
            className={css({
              alignItems: 'center',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              color: 'var(--color-th_accent)',
            })}
          >
            <Spinner size="small" />
          </div>
        ) : (
          <>
            <div
              className={css({
                color: 'var(--text-color-th_base)',
                fontSize: 14,
                fontWeight: 500,
              })}
            >
              {amountFiat}
            </div>
            <div
              className={css({
                color: 'var(--text-color-th_base-secondary)',
                fontSize: 10,
                fontFamily: 'monospace',
              })}
            >
              {amount}
            </div>
          </>
        )}
      </ButtonArea>
    </div>
  )
}

export namespace AccountBalance {
  export interface Props {
    amount: string
    chainId: number
    className?: string
    loading?: boolean
    onRefetch?: () => void
    amountFiat: string
    tokenSymbol: string
    tokenName: string
  }
}
