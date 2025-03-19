import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'

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

      <Toaster
        theme="light"
        expand={false}
        duration={3_000}
        position="top-right"
        className="z-[42069] select-none"
        swipeDirections={['right', 'left', 'top', 'bottom']}
        toastOptions={{
          style: {
            borderRadius: '1.5rem',
          },
        }}
      />
    </>
  )
}
