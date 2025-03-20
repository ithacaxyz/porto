import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'

import { DevOnly } from '~/components/DevOnly'
import { Dashboard } from './-components/Dashboard'
import { Intro } from './-components/Intro'
import { Landing } from './-components/Landing'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()

  return (
    <main className="mx-auto flex size-full max-w-[1400px] flex-col *:px-4 md:flex-row md:py-6 md:*:w-1/2">
      <DevOnly />

      <Intro />
      {account.isConnected ? <Dashboard /> : <Landing />}
    </main>
  )
}
