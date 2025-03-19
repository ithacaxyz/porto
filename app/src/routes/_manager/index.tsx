import { createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import { useAccount } from 'wagmi'

import { DevOnly } from '~/components/DevOnly'
import { Dashboard } from './-components/Dashboard'
import { Intro } from './-components/Intro'
import { Landing } from './-components/Landing'

export const Route = createFileRoute('/_manager/')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()

  return (
    <main
      className={cx(
        'bg-gray2 font-["SF_Pro_Text"]',
        'mx-auto flex size-full max-w-[1400px] flex-col px-4 md:flex-row md:py-6 md:*:w-1/2',
      )}
    >
      <DevOnly />

      <Intro />
      {account.isConnected ? <Dashboard /> : <Landing />}
    </main>
  )
}
