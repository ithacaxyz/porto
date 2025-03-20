import { createFileRoute } from '@tanstack/react-router'
import Ear from '~icons/lucide/ear'
import { Layout } from '../../components/Layout'

export const Route = createFileRoute('/dialog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          title="Listening..."
          content={<p className="text-secondary">No active requests yet.</p>}
          icon={Ear}
        />
      </Layout.Header>
    </Layout>
  )
}
