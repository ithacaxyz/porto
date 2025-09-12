import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/savings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/savings"!</div>
}
