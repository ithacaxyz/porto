import { createFileRoute } from '@tanstack/react-router'
import { PayButton } from '~/components/PayButton'

export const Route = createFileRoute('/dialog/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex flex-col gap-4 p-6">
      <PayButton variant="apple" />
      <PayButton variant="google" />
      <PayButton timeEstimate="5 mins" variant="card" />
    </main>
  )
}
