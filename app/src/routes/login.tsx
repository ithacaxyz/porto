import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [on, toggle] = React.useState(false)
  const [request, reject, respond] = useRequestsStore(
    (state) => [state.requests[0], state.reject, state.respond] as const,
  )

  return (
    <div className="p-3">
      <div>Sign in</div>

      <div>Connect your account to sign in.</div>

      <div className="flex gap-2">
        <button type="button" onClick={() => reject(request!)}>
          No thanks
        </button>

        <button type="button" onClick={() => respond(request!)}>
          Sign in
        </button>
      </div>

      <div>
        <button type="button" onClick={() => toggle((x) => !x)}>
          toggle
        </button>
        {on && <div className="h-80 w-10 bg-red-400" />}
      </div>
    </div>
  )
}
