import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import '../styles/app.css'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
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
