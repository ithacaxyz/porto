import { Spinner } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Spinner')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Spinner">
      <ComponentScreen.Section title="Size">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1 text-th_accent">
            <Spinner size="small" />
            <Spinner size="medium" />
            <Spinner size="large" />
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Color">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <Spinner color="magenta" />
            <Spinner color="var(--background-color-th_negative)" />
            <Spinner color="var(--background-color-th_positive)" />
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
