import * as Ariakit from '@ariakit/react'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { Cuer } from 'cuer'
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
  console.info('Assets:', assets.data)

  return (
    <main className="size-full">
      <section className="flex w-full flex-col justify-between gap-6 md:flex-row">
        <div className="flex w-full justify-between divide-x-2 divide-gray2 rounded-2xl bg-white px-4 md:px-9">
          <div className="transparent w-[55%] text-center">
            <p className="text-base text-gray10 dark:text-gray50">
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
                  .catch(() =>
                    toast.error('Failed to copy address to clipboard'),
                  )
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

        <div className="flex w-full justify-between">
          <div>your cash</div>
          <div>your tokens</div>
        </div>
      </section>

      <section>
        <div>
          <div className="flex justify-between">
            <p>Cash</p>
            <p>Amount</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between">
          <p>Tokens</p>
          <p>Amount</p>
        </div>
        <div>
          <pre>{Json.stringify(assets.data ?? [], null, 2)}</pre>
        </div>
      </section>
    </main>
  )
}
