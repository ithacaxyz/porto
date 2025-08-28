import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/activity')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/activity"!</div>
}
