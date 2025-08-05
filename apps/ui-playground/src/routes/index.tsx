import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-th_base-secondary">
      Please select a screen from the sidebar.
    </div>
  )
}
