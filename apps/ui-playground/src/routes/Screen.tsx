import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Screen')({
  component: ScreenComponent,
})

function ScreenComponent() {
  return (
    <ComponentScreen title="Screen">
      <div />
    </ComponentScreen>
  )
}
