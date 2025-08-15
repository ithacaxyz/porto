import { ShowAfter } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import Ear from '~icons/lucide/ear'
import { Layout } from '../-components/Layout'

export const Route = createFileRoute('/dialog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <ShowAfter delay={500}>
        <Layout.Header>
          <Layout.Header.Default
            content={
              <p className="text-th_base-secondary">No active requests yet.</p>
            }
            icon={Ear}
            title="Listening…"
          />
        </Layout.Header>
      </ShowAfter>
    </Layout>
  )
}
