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
            className="w-48 h-40 bg-th_secondary text-th_secondary"
            title="Button Area"
          />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Styling">
        <ButtonArea className="bg-th_primary text-th_primary h-40 rounded-t-th_large w-full p-4">
          bg-th_primary text-th_primary h-40
        </ButtonArea>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Disabled">
        <ButtonArea
          className="w-36 h-40 bg-th_disabled text-th_disabled p-4"
          disabled
        >
          disabled
        </ButtonArea>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

