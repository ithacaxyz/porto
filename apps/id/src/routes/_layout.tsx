import { CatchBoundary, createFileRoute, Outlet } from '@tanstack/react-router'

import { Intro } from './-components/Intro'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <Layout.Hero>
        <Intro />
      </Layout.Hero>

      <Layout.Content>
        <CatchBoundary getResetKey={() => "layout-catch"} onCatch={console.error}>
          <Outlet />
        </CatchBoundary>
      </Layout.Content>
    </Layout>
  )
}
