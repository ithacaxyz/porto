import * as Ariakit from '@ariakit/react'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { Json } from 'ox'
import { Hooks } from 'porto/wagmi'
import { toast } from 'sonner'

export const Route = createFileRoute('/_dash/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()

  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })

  const assets = Hooks.useAssets({
    account: account.address!,
    query: { enabled: !!account.address },
  })

  return (
    <main
      className={cx(
        'size-full',
        'grid grid-cols-1 grid-rows-auto gap-8',
        'md:grid-cols-2 md:grid-rows-4',
      )}
    >
      <div
        className={cx(
          'flex w-full items-center justify-between divide-x-2 divide-gray2 rounded-2xl bg-white px-4 dark:bg-gray1',
          'md:flex-row md:px-9',
        )}
      >
        <div className="transparent my-auto w-[55%] space-y-2.5 text-center">
          <p className="font-normal text-base text-gray10 dark:text-gray50">
            Your assets
          </p>
          <p className="font-medium text-3xl">$15,638.41</p>
        </div>

        <div className="flex w-[45%] justify-center text-center font-normal text-[10px]">
          <Ariakit.Button
            className="flex w-[150px] items-center justify-center gap-3 hover:cursor-pointer!"
            onClick={() =>
              copyToClipboard(account.address ?? '')
                .then(() => toast.success('Copied address to clipboard'))
                .catch(() => toast.error('Failed to copy address to clipboard'))
            }
            tabIndex={-1}
          >
            <Cuer.Root
              className="rounded-lg border border-surface bg-white p-2.5 dark:bg-secondary"
              value={account.address ?? ''}
            >
              <Cuer.Finder radius={1} />
              <Cuer.Cells />
            </Cuer.Root>
            <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-[11px] text-gray10">
              {account.address}
            </p>
          </Ariakit.Button>
        </div>
      </div>

      <div
        className={cx(
          'flex w-full justify-between divide-x divide-gray6 rounded-2xl outline-1 outline-gray6 dark:divide-gray dark:outline-gray',
          '*:h-full *:w-[50%] *:p-4',
          '',
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

      <section className={cx('col-span-full w-full')}>
        <div className="flex justify-between">
          <p>Cash</p>
          <p>Amount</p>
        </div>
      </section>

      <section className={cx('col-span-full w-full')}>
        <div className="flex justify-between">
          <p>Tokens</p>
          <p>Amount</p>
        </div>
      </section>
      <div>
        <pre>{Json.stringify(assets.data ?? [], null, 2)}</pre>
      </div>
    </main>
  )
}
