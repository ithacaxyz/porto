import { Input } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Input')({
  component: InputComponent,
})

function InputComponent() {
  return (
    <ComponentScreen title="Input">
      <ComponentScreen.Section title="Sizes" surface="base">
        <div className="flex flex-col gap-4">
          <Input size="medium" placeholder="Medium" />
          <Input size="large" placeholder="Large" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="States" surface="base">
        <div className="flex flex-col gap-4">
          <Input placeholder="Placeholder" />
          <Input disabled placeholder="Disabled" />
          <Input placeholder="With value" value="Filled value" readOnly />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Contextual" surface="base">
        <div className="flex flex-col gap-4">
          <Input placeholder="Placeholder" contextual="Optional" />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
