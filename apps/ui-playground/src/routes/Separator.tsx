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
        <Separator label="Small" size="small" />
        <Separator label="Medium" size="medium" />
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base" title="Positions">
        <Separator label="Start position (default)" />
        <Separator label="Center position" position="center" />
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base" title="Custom Spacing">
        <Separator label="No spacing" spacing={0} />
        <Separator label="4px spacing" spacing={4} />
        <Separator label="24px spacing" spacing={24} />
        <Separator label="Auto spacing (default)" />
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
