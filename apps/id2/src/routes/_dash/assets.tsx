import * as Ariakit from '@ariakit/react'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import * as React from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useFormattedAssets } from '~/hooks/useAssets'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'

export const Route = createFileRoute('/_dash/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()

  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })

  const assetsQuery = useFormattedAssets({
    account: account.address,
  })

  const assetsGroupedBySymbol = React.useMemo(
    () =>
      Object.entries(
        Object.groupBy(
          assetsQuery.data ?? [],
          (asset) => asset.metadata?.symbol ?? '',
        ),
      ),
    [assetsQuery.data],
  )

  const totalAssetsValue = React.useMemo(
    () =>
      Number.parseFloat(
        assetsQuery.data
          ?.reduce((acc, asset) => acc + asset.value, 0)
          .toString() ?? '0',
      ).toFixed(2),
    [assetsQuery.data],
  )

  return (
    <main
      className={cx(
        'size-full',
        'grid grid-cols-1 grid-rows-auto content-start gap-x-8 gap-y-4',
        'md:grid-cols-2',
      )}
    >
      <div
        className={cx(
          'flex max-h-[160px] w-full justify-between divide-x divide-gray3 rounded-2xl bg-white dark:divide-gray dark:bg-gray1',
          '*:h-full *:w-[50%] *:p-4',
          'md:flex-row',
        )}
      >
        <div className="transparent my-auto flex w-[55%] flex-col items-start justify-center space-y-2.5 text-center md:items-center">
          <p className="text-left font-normal text-base text-gray10 dark:text-gray50">
            Your assets
          </p>
          <p className="font-medium text-3xl">
            <FormatPrice value={totalAssetsValue} />
          </p>
        </div>

        <div className="flex w-[45%] justify-center text-center font-normal text-[10px]">
          <Ariakit.Button
            className="flex w-[175px] items-center justify-center gap-3 hover:cursor-pointer!"
            onClick={() =>
              copyToClipboard(account.address ?? '')
                .then(() => toast.success('Copied address to clipboard'))
                .catch(() => toast.error('Failed to copy address to clipboard'))
            }
            tabIndex={-1}
          >
            <Cuer.Root
              className="rounded-lg bg-white p-2.5 dark:bg-secondary"
              value={account.address ?? ''}
            >
              <Cuer.Finder radius={1} />
              <Cuer.Cells />
            </Cuer.Root>
            <p className="hidden min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-[11px] text-gray10 md:block">
              {account.address}
            </p>
          </Ariakit.Button>
        </div>
      </div>

      <div
        className={cx(
          'flex max-h-[160px] w-full justify-between divide-x divide-gray6 rounded-2xl outline-1 outline-gray6 dark:divide-gray dark:outline-gray',
          '*:h-full *:w-[50%] *:p-4',
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <p className="font-normal text-base text-gray10 dark:text-gray50">
            Your cash
          </p>
          <p className="font-medium text-3xl">
            <FormatPrice value="228.41" />
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <p className="font-normal text-base text-gray10 dark:text-gray50">
            Your tokens
          </p>
          <p className="font-medium text-3xl">
            <FormatPrice value="15,638.41" />
          </p>
        </div>
      </div>

      <section className={cx('col-span-full flex size-full flex-col p-2')}>
        <div className="mb-4 flex justify-between">
          <p className="font-medium text-gray8 text-lg">Tokens</p>
          <p className="hidden font-medium text-gray8 text-md md:block">
            Amount
          </p>
        </div>
        <ul className="space-y-4">
          {assetsGroupedBySymbol?.map(([symbol, assets]) => (
            <li className="flex items-center gap-2" key={symbol}>
              <img
                alt={assets?.at(0)?.metadata?.name ?? 'Token icon'}
                className="size-8"
                src={`/token-icons/${assets?.at(0)?.metadata?.symbol?.toLowerCase() ?? 'fallback'}.svg`}
              />
              <span className="mx-3 font-medium text-blackA1 text-lg">
                {assets?.at(0)?.metadata?.name}
              </span>
              <div className="wrapper ml-auto">
                <Ariakit.HovercardProvider>
                  <Ariakit.HovercardAnchor>
                    <div className="flex size-7 items-center justify-center rounded-full bg-gray4 p-1">
                      <ChainDistributionRing
                        assets={assets ?? []}
                        className=""
                      />
                    </div>
                  </Ariakit.HovercardAnchor>
                  <Ariakit.Hovercard
                    className="relative z-50 flex w-[275px] flex-col gap-2 rounded-lg bg-[white] px-4 py-3 text-[black] shadow-[0px_4px_39px_0px_rgba(0,0,0,0.05)]"
                    gutter={16}
                  >
                    <Ariakit.HovercardHeading className="flex justify-between font-medium text-base text-gray9">
                      <span>Network</span>
                      <span>{assets?.at(0)?.metadata?.symbol}</span>
                    </Ariakit.HovercardHeading>
                    <div className="flex w-full items-center gap-3 font-medium text-base">
                      <ul className="flex w-full flex-col gap-2">
                        {assets?.map((asset) => (
                          <li
                            className="flex w-full items-stretch justify-between gap-2"
                            key={asset.chainId}
                          >
                            <img
                              alt={asset.metadata?.name ?? 'Token icon'}
                              className="size-7"
                              src={`https://tokenlist.up.railway.app/icon/${asset.chainId}`}
                            />
                            <span className="my-auto flex items-center gap-2 align-middle font-medium text-gray9 text-md">
                              {asset.chainName}
                            </span>
                            <span className="ml-auto text-right font-medium text-blackA1 text-md">
                              ${Number(asset.value).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Ariakit.Hovercard>
                </Ariakit.HovercardProvider>
              </div>
              <span className="mx-4 font-medium text-blackA1 text-lg">
                ${Sum(assets)}
              </span>
              <Ariakit.Button
                render={
                  <Link
                    className="flex size-9 items-center justify-center rounded-full bg-gray1 outline-1 outline-gray5"
                    search={{
                      address: `${assets?.at(0)?.chainId}:${assets?.at(0)?.address}`,
                    }}
                    to=".."
                  >
                    <LucideSendHorizontal className="size-5 text-gray8" />
                  </Link>
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* <div>
        <pre>{Json.stringify(assetsQuery.data ?? [], null, 2)}</pre>
      </div> */}
    </main>
  )
}

function Sum<T extends ReadonlyArray<{ value: number }>>(
  assets: T | undefined,
) {
  const sum = Number.parseFloat(
    assets
      ?.reduce((accumulator, asset) => accumulator + asset.value, 0)
      .toString() ?? '0',
  ).toFixed(2)

  return <FormatPrice value={sum} />
}

function FormatPrice(props: FormatPrice.Props) {
  const { value } = props
  const [amount, decimals] = value.split('.')
  return (
    <React.Fragment>
      ${amount}.<span className="text-gray10">{decimals}</span>
    </React.Fragment>
  )
}

declare namespace FormatPrice {
  type Props = {
    value: string
  }
}

const chainColorPalette = [
  '#6366F1',
  '#22D3EE',
  '#F97316',
  '#10B981',
  '#A855F7',
  '#F43F5E',
  '#0EA5E9',
  '#FBBF24',
] as const

const MIN_SEGMENT_PERCENTAGE = 0.03
const MAX_SEGMENT_COUNT = 5
const RING_SIZE = 28
const RING_STROKE_WIDTH = 4
const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2
const RING_CENTER = RING_SIZE / 2

function ChainDistributionRing(props: ChainDistributionRing.Props) {
  const { assets, className } = props

  const chainColorCache = React.useRef(new Map<number, string>())

  const getChainColor = React.useCallback((chainId: number) => {
    if (!Number.isFinite(chainId)) return '#94A3B8'

    const cache = chainColorCache.current
    if (cache.has(chainId)) return cache.get(chainId)! ?? '#94A3B8'

    const nextColor =
      chainColorPalette[cache.size % chainColorPalette.length] ??
      chainColorPalette[chainColorPalette.length - 1]
    cache.set(chainId, nextColor ?? '#94A3B8')
    return nextColor ?? '#94A3B8'
  }, [])

  const segments = React.useMemo(() => {
    const totalsByChain = assets.reduce<Map<number, number>>(
      (accumulator, asset) => {
        if (!asset) return accumulator
        if (!Number.isFinite(asset.value) || asset.value <= 0)
          return accumulator
        if (!Number.isFinite(asset.chainId)) return accumulator
        accumulator.set(
          asset.chainId,
          (accumulator.get(asset.chainId) ?? 0) + asset.value,
        )
        return accumulator
      },
      new Map(),
    )

    const total = Array.from(totalsByChain.values()).reduce(
      (accumulator, amount) => accumulator + amount,
      0,
    )

    if (total <= 0)
      return [] as Array<{ chainId: number; percentage: number; color: string }>

    const aggregated = Array.from(totalsByChain.entries())
      .map(([chainId, value]) => ({
        chainId,
        percentage: Math.min(1, Math.max(0, value / total)),
        value,
      }))
      .filter((segment) => segment.percentage > 0)
      .sort((left, right) => right.value - left.value)

    let filtered = aggregated.filter(
      (segment) => segment.percentage >= MIN_SEGMENT_PERCENTAGE,
    )

    if (filtered.length === 0 && aggregated.length > 0)
      filtered = aggregated.slice(0, 1)

    if (filtered.length > MAX_SEGMENT_COUNT)
      filtered = filtered.slice(0, MAX_SEGMENT_COUNT)

    return filtered.map((segment) => ({
      chainId: segment.chainId,
      color: getChainColor(segment.chainId),
      percentage: segment.percentage,
    }))
  }, [assets, getChainColor])

  const circumference = 2 * Math.PI * RING_RADIUS
  let cumulative = 0

  return (
    <svg
      aria-hidden
      className={cx('size-full', className)}
      height={RING_SIZE}
      role="presentation"
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      width={RING_SIZE}
    >
      <circle
        cx={RING_CENTER}
        cy={RING_CENTER}
        fill="none"
        r={RING_RADIUS}
        stroke="var(--gray6, rgba(99, 102, 106, 0.35))"
        strokeWidth={RING_STROKE_WIDTH}
      />
      {segments.map((segment) => {
        const dashLength = circumference * segment.percentage
        if (dashLength <= 0) {
          return null
        }
        const dashArray = `${dashLength} ${circumference - dashLength}`
        const strokeDashoffset = circumference * (1 - cumulative)
        cumulative += segment.percentage

        return (
          <circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            fill="none"
            key={segment.chainId}
            r={RING_RADIUS}
            stroke={segment.color}
            strokeDasharray={dashArray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            strokeWidth={RING_STROKE_WIDTH}
            transform={`rotate(-90 ${RING_CENTER} ${RING_CENTER})`}
          />
        )
      })}
    </svg>
  )
}

declare namespace ChainDistributionRing {
  type Props = {
    className?: string
    assets: ReadonlyArray<{ chainId: number; value: number }>
  }
}
