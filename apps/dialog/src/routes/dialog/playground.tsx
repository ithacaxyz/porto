import { Env } from '@porto/apps'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { PayButton } from '~/components/PayButton.tsx'

export const Route = createFileRoute('/dialog/playground')({
  beforeLoad: (context) => {
    if (Env.get() === 'prod') throw redirect({ to: '/dialog' })
    return context
  },
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
