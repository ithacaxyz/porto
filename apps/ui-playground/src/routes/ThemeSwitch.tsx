import { ThemeSwitch } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useColorScheme } from '~/ColorScheme'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ThemeSwitch')({
  component: ColorSchemeSwitchComponent,
})

function ColorSchemeSwitchComponent() {
  const { colorScheme, setColorScheme } = useColorScheme()
  return (
    <ComponentScreen title="ThemeSwitch">
      <ComponentScreen.Section title="Default">
        <ThemeSwitch colorScheme={colorScheme} onChange={setColorScheme} />
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
