import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dash/assets"!</div>
}
