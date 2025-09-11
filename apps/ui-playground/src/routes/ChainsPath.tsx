import { ChainsPath } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ChainsPath')({
  component: ChainsPathComponent,
})

function ChainsPathComponent() {
  return (
    <ComponentScreen title="ChainsPath">
      <ComponentScreen.Section surface="base-alt" title="Single chain">
        <div className="flex flex-col gap-4">
          <ChainsPath chainIds={[1]} />
          <ChainsPath chainIds={[10]} />
          <ChainsPath chainIds={[137]} />
          <ChainsPath chainIds={[8453]} />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Two chains">
        <div className="flex flex-col gap-4">
          <ChainsPath chainIds={[137, 1]} />
          <ChainsPath chainIds={[10, 1]} />
          <ChainsPath chainIds={[8453, 1]} />
          <ChainsPath chainIds={[42161, 1]} />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Multiple chains">
        <div className="flex flex-col gap-4">
          <ChainsPath chainIds={[137, 10, 1]} />
          <ChainsPath chainIds={[8453, 42161, 137, 1]} />
          <ChainsPath chainIds={[10, 8453, 42161, 137, 1]} />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Unknown chains">
        <div className="flex flex-col gap-4">
          <ChainsPath chainIds={[999999]} />
          <ChainsPath chainIds={[999999, 1]} />
          <ChainsPath chainIds={[137, 999999, 1]} />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
