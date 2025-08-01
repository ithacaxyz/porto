import { ColorSchemeSwitch } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useColorScheme } from '~/ColorScheme'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ColorSchemeSwitch')({
  component: ColorSchemeSwitchComponent,
})

function ColorSchemeSwitchComponent() {
  const { colorScheme, setColorScheme } = useColorScheme()
  return (
    <ComponentScreen title="ColorSchemeSwitch">
      <ComponentScreen.Section title="Default">
        <ColorSchemeSwitch
          colorScheme={colorScheme}
          onChange={setColorScheme}
        />
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
