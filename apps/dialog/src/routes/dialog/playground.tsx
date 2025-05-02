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
    <main className="flex flex-col p-6">
      <section className="flex max-w-xs flex-col gap-4">
        <PayButton data-playground variant="apple" />
        <PayButton data-playground variant="google" />
        <PayButton data-playground timeEstimate="5 mins" variant="card" />
      </section>
    </main>
  )
}
