import { createFileRoute } from '@tanstack/react-router'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const [request, reject, respond] = useRequestsStore(
    (state) => [state.requests[0], state.reject, state.respond] as const,
  )

  return (
    <div className="p-3">
      <div>Sign up</div>

      <div>Sign up with passkey. This should only take a few seconds.</div>

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
