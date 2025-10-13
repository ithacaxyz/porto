import { Chains } from 'porto'
import { Children, createContext, useContext } from 'react'
import LucideRefreshCw from '~icons/lucide/refresh-cw'
import { css, cx } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'
import { ChainIcon } from '../ChainIcon/ChainIcon.js'
import { Spinner } from '../Spinner/Spinner.js'
import { TokenIcon } from '../TokenIcon/TokenIcon.js'

export function Balance({
  amount,
  chainId,
  className,
  fetching = false,
  onRefetch,
  amountFiat,
  tokenSymbol,
  tokenName,
  warn = false,
}: Balance.Props) {
  const groupContext = useContext(Balance.Group.Context)
  const chain = Chains.all.find((c) => c.id === chainId)
  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          backgroundColor: 'var(--background-color-th_field)',
          display: 'flex',
          gap: 16,
          height: 54,
          paddingLeft: 12,
        }),
        css({
          border: '1px solid var(--border-color-th_field)',
        }),
        groupContext
          ? css({
              borderRadius: 0,
              borderTopWidth: 0,
            })
          : css({
              borderRadius: 'var(--radius-th_medium)',
            }),
        groupContext?.isFirst &&
          css({
            borderTopLeftRadius: 'var(--radius-th_medium)',
            borderTopRightRadius: 'var(--radius-th_medium)',
            borderTopWidth: 1,
          }),
        groupContext?.isLast &&
          css({
            borderBottomLeftRadius: 'var(--radius-th_medium)',
            borderBottomRightRadius: 'var(--radius-th_medium)',
          }),
        className,
      )}
    >
      <div
        className={css({
          flexShrink: 0,
          position: 'relative',
        })}
      >
        <TokenIcon size={20} symbol={tokenSymbol} />
        <ChainIcon
          border
          chainId={chainId}
          className={css({
            left: 12,
            position: 'absolute',
            top: 12,
          })}
          size={14}
        />
      </div>
      <div
        className={css({
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          minWidth: 0,
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
            color: 'var(--text-color-th_base-secondary)',
            fontSize: 11,
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          })}
        >
          on {chain?.name || `Chain ${chainId}`}
        </div>
      </div>
      <ButtonArea
        className={css({
          alignItems: 'center',
          borderRadius: 'var(--radius-th_medium)',
          display: 'flex',
          flexShrink: 0,
          gap: 8,
          height: '100%',
          marginLeft: 'auto',
          paddingInline: 12,
        })}
        disabled={!onRefetch || fetching}
        onClick={onRefetch}
        style={{ outlineOffset: -1 }}
      >
        <div
          className={css({
            alignItems: 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
            paddingBlock: 8,
          })}
        >
          <div
            className={cx(
              css({
                fontSize: 14,
                fontWeight: 500,
                overflow: 'hidden',
                textAlign: 'right',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }),
              warn
                ? css({ color: 'var(--text-color-th_base-warning)' })
                : css({ color: 'var(--text-color-th_base)' }),
            )}
            title={`${amountFiat} (${amount})`}
          >
            {amountFiat}
          </div>
        </div>
        <div
          className={css({
            alignItems: 'center',
            backgroundColor: 'var(--background-color-th_base-alt)',
            borderRadius: '50%',
            display: 'flex',
            flexShrink: 0,
            height: 20,
            justifyContent: 'center',
            position: 'relative',
            width: 20,
          })}
        >
          <div
            className={css({
              display: 'grid',
              inset: 0,
              placeItems: 'center',
              position: 'absolute',
            })}
            title={fetching ? 'Fetching balance…' : undefined}
          >
            {fetching ? (
              <Spinner
                color="var(--text-color-th_base-secondary)"
                size={12}
                thickness={1}
              />
            ) : (
              <LucideRefreshCw
                className={css({
                  color: 'var(--text-color-th_base-secondary)',
                  height: 12,
                  width: 12,
                })}
              />
            )}
          </div>
        </div>
      </ButtonArea>
    </div>
  )
}

export namespace Balance {
  export interface Props {
    amount: string
    chainId: number
    className?: string
    fetching?: boolean
    onRefetch?: () => void
    amountFiat: string
    tokenSymbol: string
    tokenName: string
    warn?: boolean
  }

  export function Group({ children, className }: Group.Props) {
    const items = Children.count(children)
    return (
      <div
        className={cx(
          css({
            display: 'flex',
            flexDirection: 'column',
          }),
          className,
        )}
      >
        {Children.map(children, (child, index) => (
          <Balance.Group.Context.Provider
            value={{
              isFirst: index === 0,
              isLast: index === items - 1,
            }}
          >
            {child}
          </Balance.Group.Context.Provider>
        ))}
      </div>
    )
  }

  export namespace Group {
    export interface Props {
      children: React.ReactNode
      className?: string
    }
    export const Context = createContext<{
      isFirst: boolean
      isLast: boolean
    } | null>(null)
  }
}
