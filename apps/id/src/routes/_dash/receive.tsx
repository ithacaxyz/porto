import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/receive')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/receive"!</div>
}
