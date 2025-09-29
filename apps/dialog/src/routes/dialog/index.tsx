import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../-components/Layout'

export const Route = createFileRoute('/dialog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Layout.Content>
        <div className="h-[96px]" />
      </Layout.Content>
    </Layout>
  )
}
