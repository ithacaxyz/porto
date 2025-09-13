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
            <Spinner color="#f0f" />
            <Spinner color="var(--background-color-th_negative)" />
            <Spinner color="var(--background-color-th_positive)" />
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Base color">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <Spinner
              baseColor="rgba(0, 122, 255, 0.1)"
              color="var(--color-th_accent)"
            />
            <Spinner baseColor="rgba(255, 0, 255, 0.1)" color="#f0f" />
            <Spinner
              baseColor="rgba(255, 59, 48, 0.1)"
              color="var(--background-color-th_negative)"
            />
            <Spinner
              baseColor="rgba(52, 199, 89, 0.1)"
              color="var(--background-color-th_positive)"
            />
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
