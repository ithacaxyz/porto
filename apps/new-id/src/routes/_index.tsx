import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Intro } from './-components/Intro'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_index')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Layout.Hero>
        <Intro />
      </Layout.Hero>

      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
