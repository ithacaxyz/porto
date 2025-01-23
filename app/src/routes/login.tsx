import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideLogIn from '~icons/lucide/log-in'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { IndeterminateLoader } from '../components/IndeterminateLoader'
import { useAppStore } from '../lib/app'
import { usePortoState } from '../lib/porto'
import { useRequestsStore } from '../lib/requests'
import { StringFormatter } from '../utils'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const hostname = useAppStore((state) => new URL(state.targetOrigin).hostname)
  const address = usePortoState((state) => state.accounts[0]?.address)
  const [loading, setLoading] = React.useState(false)

  const [request, reject, respond] = useRequestsStore(
    (state) => [state.requests[0], state.reject, state.respond] as const,
  )

  if (loading)
    return (
      <div className="flex flex-grow flex-col justify-center">
        <IndeterminateLoader title="Signing in" />
      </div>
    )

  return (
    <div className="flex flex-grow flex-col justify-between">
      <div className="px-3 pt-3">
        <Header
          title="Sign in"
          icon={LucideLogIn}
          content={
            <>
              Authenticate with your passkey wallet to start using{' '}
              <span className="font-medium">{hostname}</span>.
            </>
          }
        />
      </div>

      <div>
        <div className="flex gap-2 px-3 pb-3">
          <Button
            className="flex-grow"
            type="button"
            onClick={() => reject(request!)}
          >
            No thanks
          </Button>

          <Button
            className="flex-grow"
            type="button"
            variant="primary"
            onClick={() => {
              setLoading(true)
              respond(request!).then(() => setTimeout(() => setLoading(false)))
            }}
          >
            Sign in
          </Button>
        </div>

        {address && (
          <div className="flex justify-between border-blackA1 border-t p-3 dark:border-whiteA1">
            <div className="text-[13px] text-gray9 leading-[22px]">Wallet</div>

            <div className="flex items-center gap-1.5">
              <div className="font-medium text-[14px] text-gray12">
                {StringFormatter.truncate(address, { start: 6, end: 4 })}
              </div>
              <button type="button">
                <LucideChevronDown className="mt-0.5 size-5 text-gray12/50" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
