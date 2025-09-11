import { Chains } from 'porto'
import { useMemo } from 'react'
import { css } from '../../styled-system/css'
import { ChainIcon } from '../ChainIcon/ChainIcon.js'

export function ChainsPath({ chainIds }: ChainsPath.Props) {
  const [destinationChain, ...sourceChains] = useMemo(
    () =>
      chainIds
        .map(
          (id) =>
            Chains.all.find((c) => c.id === id) || {
              id,
              name: `Unknown (${id})`,
            },
        )
        .reverse(),
    [chainIds.map],
  )
  return (
    destinationChain && (
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          fontSize: 14,
          fontWeight: 500,
          gap: 6,
        })}
      >
        {sourceChains.length === 0 ? (
          <>
            <ChainIcon chainId={destinationChain.id} size={18} />
            {destinationChain.name}
          </>
        ) : (
          <>
            <ChainIcon.Stack border={false} size={18}>
              {sourceChains.reverse().map((chain) => (
                <ChainIcon chainId={chain.id} key={chain.id} />
              ))}
            </ChainIcon.Stack>
            <ChainsPath.Arrow />
            <ChainIcon chainId={destinationChain.id} size={18} />
          </>
        )}
      </div>
    )
  )
}

export namespace ChainsPath {
  export interface Props {
    chainIds: readonly number[]
    className?: string
  }

  export function Arrow() {
    return (
      <div
        className={css({
          alignItems: 'center',
          backgroundColor: 'var(--background-color-th_badge)',
          borderRadius: '50%',
          display: 'flex',
          height: 16,
          justifyContent: 'center',
          width: 16,
        })}
        title="to"
      >
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: title is provided by the parent div */}
        <svg
          className={css({
            color: 'var(--text-color-th_badge)',
          })}
          fill="none"
          height={16}
          viewBox="0 0 16 16"
          width={16}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4.5 11.5 8m0 0L8 11.5M11.5 8h-7"
            stroke="#838383"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      </div>
    )
  }
}
