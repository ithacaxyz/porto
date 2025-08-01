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
        <div className="flex h-40 w-full max-w-2xl items-center justify-center gap-4 rounded-th_medium border border-th_frame border-r bg-th_frame p-4">
          <ThemeSwitch colorScheme={colorScheme} onChange={setColorScheme} />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
