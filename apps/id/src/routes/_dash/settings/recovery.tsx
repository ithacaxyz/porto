import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/settings"!</div>
}
