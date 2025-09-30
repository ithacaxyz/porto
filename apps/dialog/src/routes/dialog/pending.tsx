import { ShowAfter, Spinner } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../-components/Layout'

export const Route = createFileRoute('/dialog/pending')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <ShowAfter delay={1000}>
        <div className="flex h-40 items-center justify-center text-th_base-secondary">
          <Spinner size="large" />
        </div>
      </ShowAfter>
    </Layout>
  )
}
