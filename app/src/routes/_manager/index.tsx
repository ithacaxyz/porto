import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'

import { Dashboard } from './-components/Dashboard'
import { Landing } from './-components/Landing'

export const Route = createFileRoute('/_manager/')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()
  if (account.isConnected) return <Dashboard />
  return <Landing />
}
