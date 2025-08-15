import { ButtonArea } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ButtonArea')({
  component: ButtonAreaScreen,
})

function ButtonAreaScreen() {
  return (
    <ComponentScreen title="ButtonArea">
      <ComponentScreen.Section title="Base">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonArea
            className="h-40 w-48 bg-th_secondary text-th_secondary"
            title="Button Area"
          />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Styling">
        <ButtonArea className="h-40 w-full rounded-t-th_large bg-th_primary p-4 text-th_primary">
          bg-th_primary text-th_primary h-40
        </ButtonArea>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Disabled">
        <ButtonArea
          className="h-40 w-36 bg-th_disabled p-4 text-th_disabled"
          disabled
        >
          disabled
        </ButtonArea>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
