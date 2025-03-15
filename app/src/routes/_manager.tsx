import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'

import { NavigationProgress } from '~/components/NavigationProgress'
import managerCss from '~/styles/manager.css?url'

export const Route = createFileRoute('/_manager')({
  component: RouteComponent,
  head: () => ({
    links: [{ rel: 'stylesheet', href: managerCss }],
  }),
})

function RouteComponent() {
  return (
    <>
      <Outlet />
      <NavigationProgress />

      <Toaster
        expand={true}
        theme="light"
        duration={3000}
        position="top-right"
        className="z-[42069] select-none"
        swipeDirections={['right', 'left', 'top', 'bottom']}
      />
    </>
  )
}
