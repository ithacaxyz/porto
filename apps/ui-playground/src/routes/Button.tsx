import { Button } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Button')({
  component: ButtonComponent,
})

function ButtonComponent() {
  return (
    <ComponentScreen title="Button">
      <ComponentScreen.Section title="Variants">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="strong">Strong</Button>
          <Button variant="negative">Negative</Button>
          <Button variant="negative-secondary">Negative Secondary</Button>
          <Button variant="positive">Positive</Button>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="States">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
