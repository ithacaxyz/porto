import { createFileRoute } from '@tanstack/react-router'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
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
    </div>
  )
}
