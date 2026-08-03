import { createFileRoute, Outlet } from '@tanstack/react-router'

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
        <DeprecationBanner />
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

function DeprecationBanner() {
  return (
    <div className="border-gray4 mb-4 border-b bg-gray2 px-4 py-2 text-center font-[400] text-[14px] text-gray12 leading-[20px]">
      Porto is deprecated.{' '}
      <a
        aria-label="Transfer funds from Porto"
        className="font-[500] underline underline-offset-2"
        href="https://id.porto.sh/recover"
      >
        Transfer your funds
      </a>
      .
    </div>
  )
}
