import { Input } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Input')({
  component: InputComponent,
})

function InputComponent() {
  return (
    <ComponentScreen title="Input">
      <ComponentScreen.Section surface="base" title="Sizes">
        <div className="flex flex-col gap-4">
          <Input placeholder="Medium" size="medium" />
          <Input placeholder="Large" size="large" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="States">
        <div className="flex flex-col gap-4">
          <Input placeholder="Placeholder" />
          <Input disabled placeholder="Disabled" />
          <Input placeholder="With value" readOnly value="Filled value" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Contextual">
        <div className="flex flex-col gap-4">
          <Input contextual="Optional" placeholder="Placeholder" />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
