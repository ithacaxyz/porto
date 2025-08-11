import { Separator } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Separator')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Separator">
      <ComponentScreen.Section surface="base" title="Sizes">
        <Separator label="Small" />
        <Separator label="Medium" />
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
