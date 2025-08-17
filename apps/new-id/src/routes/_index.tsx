import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Intro } from './-components/Intro'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_index')({
  component: RouteComponent,
  errorComponent: (props) => {
    console.info(
      '[_index.tsx] errorComponent',
      JSON.stringify(props, undefined, 2),
    )
    return (
      <div>
        <p>[_index.tsx] Error</p>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </div>
    )
  },
  pendingComponent: (props) => {
    console.info(
      '[_index.tsx] pendingComponent',
      JSON.stringify(props, undefined, 2),
    )
    return (
      <div>
        <p>[_index.tsx] Loading…</p>
        <pre>{JSON.stringify(props, undefined, 2)}</pre>
      </div>
    )
  },
  ssr: true,
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
