import { createFileRoute } from '@tanstack/react-router'

import { Layout } from '~/components/AppLayout'
import { Header } from '~/components/Header'

export const Route = createFileRoute('/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Header />
      <main className="flex flex-col gap-y-5 p-3">
        <div className="flex items-center gap-x-3">
          <p className="font-medium text-lg">Recovery methods</p>
        </div>
      </main>
    </Layout>
  )
}
