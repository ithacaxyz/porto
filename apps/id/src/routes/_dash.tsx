import { LogoLockup } from '@porto/apps/components'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useAccountEffect } from 'wagmi'

export const Route = createFileRoute('/_dash')({
  beforeLoad(opts) {
    const { context } = opts
    if (!context.account.address) throw redirect({ to: '/auth' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  useAccountEffect({
    onDisconnect() {
      navigate({ to: '/auth' })
    },
  })
  return (
    <div className="flex h-full px-7.5 py-6 pb-7.5">
      <div className="flex h-full w-72.75 flex-col bg-gray3">
        <div className="h-7.5">
          <LogoLockup />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
