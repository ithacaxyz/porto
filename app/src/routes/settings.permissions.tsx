import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/permissions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/settings/permissions"!</div>
}
