import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/verify')({
  component: RouteComponent,
})

function RouteComponent() {
  // TODO: Designs WIP
  return (
    <div>
      <div>Verifying email</div>
    </div>
  )
}
