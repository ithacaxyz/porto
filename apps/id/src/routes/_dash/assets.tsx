import * as Ariakit from '@ariakit/react'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { Json } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { formatUnits } from 'viem'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'

export const Route = createFileRoute('/_dash/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()

  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })

  const assetsQuery = Hooks.useAssets({
    account: account.address!,
    query: {
      enabled: !!account.address,

      select: (data) =>
        Object.entries(data).flatMap(([chainId, assets]) =>
          assets
            .filter((asset) => asset.balance > 0n && chainId !== '0')
            .map((asset) => ({
              ...asset,
              chainId: Number.parseInt(chainId, 10),
              value:
                Number(
                  formatUnits(asset.balance, asset.metadata?.decimals ?? 18),
                ) * (asset.metadata?.fiat?.value ?? 0),
            })),
        ),
    },
  })

  const assetsGroupedBySymbol = React.useMemo(
    () =>
      Object.groupBy(
        assetsQuery.data ?? [],
        (asset) => asset.metadata?.symbol ?? '',
      ),
    [assetsQuery.data],
  )
  console.info(assetsGroupedBySymbol)

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
          'md:flex-row md:px-9',
        )}
      >
        <div className="transparent my-auto flex w-[55%] flex-col items-start justify-center space-y-2.5 text-center md:items-center">
          <p className="text-left font-normal text-base text-gray10 dark:text-gray50">
            Your assets
          </p>
          <p className="font-medium text-3xl">${totalAssetsValue}</p>
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
          <p className="font-medium text-3xl">$228.41</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <p className="font-normal text-base text-gray10 dark:text-gray50">
            Your tokens
          </p>
          <p className="font-medium text-3xl">$15,638.41</p>
        </div>
      </div>

      <section className={cx('col-span-full flex size-full flex-col p-2')}>
        <div className="mb-4 flex justify-between">
          <p className="font-medium text-base text-gray9">Tokens</p>
          <p className="font-medium text-base text-gray9">Amount</p>
        </div>
        <ul className="space-y-4">
          {assetsQuery.data?.map((asset) => (
            <li
              className="flex items-center gap-2"
              key={`${asset.chainId}:${asset.address}`}
            >
              <img
                alt={asset.metadata?.name ?? 'Token icon'}
                className="size-8"
                src={`/token-icons/${asset.metadata?.symbol?.toLowerCase() ?? 'fallback'}.svg`}
              />
              <span className="mx-3 font-medium text-blackA1 text-lg">
                {asset.metadata?.name}
              </span>
              <div className="wrapper ml-auto">
                <Ariakit.HovercardProvider>
                  <Ariakit.HovercardAnchor>x</Ariakit.HovercardAnchor>
                  <Ariakit.Hovercard
                    className="relative z-50 flex w-[250px] flex-col gap-2 rounded-lg bg-[white] px-4 py-3 text-[black] outline-1 outline-gray6"
                    gutter={16}
                  >
                    <Ariakit.HovercardHeading className="flex justify-between font-medium text-base text-gray9">
                      <span>Network</span>
                      <span>{asset.metadata?.symbol}</span>
                    </Ariakit.HovercardHeading>
                    <Ariakit.HovercardDescription className="flex w-full items-center gap-3 font-medium text-base">
                      <img
                        alt={asset.metadata?.name ?? 'Token icon'}
                        className="size-7"
                        src={`/token-icons/${asset.metadata?.symbol?.toLowerCase() ?? 'fallback'}.svg`}
                      />
                      <span className="font-medium text-gray9 text-lg">
                        {asset.metadata?.symbol}
                      </span>
                      <span className="ml-auto font-medium text-blackA1 text-lg">
                        ${Number(asset.value).toFixed(2)}
                      </span>
                    </Ariakit.HovercardDescription>
                  </Ariakit.Hovercard>
                </Ariakit.HovercardProvider>
              </div>
              <span className="mx-4 font-medium text-blackA1 text-lg">
                ${asset.value.toFixed(2)}
              </span>
              <Ariakit.Button
                render={
                  <Link
                    className="flex size-9 items-center justify-center rounded-full bg-gray1 outline-1 outline-gray5"
                    search={{
                      address: `${asset.chainId}:${asset.address}`,
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

      <div>
        <pre>{Json.stringify(assetsQuery.data ?? [], null, 2)}</pre>
      </div>
    </main>
  )
}
