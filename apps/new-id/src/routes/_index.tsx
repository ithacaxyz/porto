import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Intro } from './-components/Intro'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_index')({
  component: RouteComponent,
  errorComponent: (props) => {
    console.info('[_index.tsx] errorComponent', props)
    return <div>[_index.tsx] Error</div>
  },
  pendingComponent: (props) => {
    console.info('[_index.tsx] pendingComponent', props)
    return <div>[_index.tsx] Loading…</div>
  },
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
