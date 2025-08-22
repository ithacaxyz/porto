import { ShowAfter } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ShowAfter')({
  component: ShowAfterComponent,
})

function ShowAfterComponent() {
  return (
    <ComponentScreen title="ShowAfter">
      <ComponentScreen.Section title="Delays" surface="base">
        <div className="space-y-4">
          {[0, 500, 1000, 2000].map((delay) => (
            <ShowAfter key={delay} delay={delay}>
              Appears after {delay}ms
            </ShowAfter>
          ))}
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

