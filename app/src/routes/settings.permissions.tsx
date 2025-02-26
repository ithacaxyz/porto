import { createFileRoute } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'

import { Layout } from '~/components/AppLayout'
import { Header } from '~/components/Header'

export const Route = createFileRoute('/settings/permissions')({
  component: RouteComponent,
  head: (_context) => ({
    meta: [
      { name: 'title', content: 'Permissions' },
      { name: 'description', content: 'Manage your wallet permissions' },
    ],
  }),
})

function RouteComponent() {

  const permissions = Hooks.usePermissions()
  console.info('permissions', permissions)

  return (
    <Layout>
      <Header />
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </Layout>
  )
}
