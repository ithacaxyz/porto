import { createFileRoute } from '@tanstack/react-router'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const requests = useRequestsStore((state) => state.requests)
  return (
    <div>
      <div>requests: {requests.length ?? 0}</div>
    </div>
  )
}
