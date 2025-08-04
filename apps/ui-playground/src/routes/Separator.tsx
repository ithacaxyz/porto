import { Separator } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Separator')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Separator">
      <ComponentScreen.Section title="Sizes">
        <div className="dark color-scheme-dark flex w-full items-center gap-4">
          <div className="w-full rounded-th_medium border border-th_base bg-th_base p-4">
            <Separator label="Small" />
            <Separator label="Medium" />
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
