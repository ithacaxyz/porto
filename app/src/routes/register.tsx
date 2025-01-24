import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import LucideLogIn from '~icons/lucide/log-in'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { IndeterminateLoader } from '../components/IndeterminateLoader'
import { useAppStore } from '../lib/app'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const hostname = useAppStore((state) => state.referrer?.hostname)
  const [loading, setLoading] = React.useState(false)

  const [request, reject, respond] = useRequestsStore(
    (state) => [state.requests[0], state.reject, state.respond] as const,
  )

  if (loading)
    return (
      <div className="p-3">
        <IndeterminateLoader title="Signing up" />
      </div>
    )

  return (
    <div className="flex flex-col p-3">
      <Header
        title="Sign up"
        icon={LucideLogIn}
        content={
          <>
            Create a new passkey wallet to start using{' '}
            <span className="font-medium">{hostname}</span>.
          </>
        }
      />

      <div className="mt-3 flex gap-2">
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
            respond(request!)
              .catch(() => setLoading(false))
              .then(() => setTimeout(() => setLoading(false)))
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  )
}
