import { ChainIcon } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ChainIcon')({
  component: ChainIconComponent,
})

function ChainIconComponent() {
  return (
    <ComponentScreen title="ChainIcon">
      <ComponentScreen.Section surface="base-alt" title="Default">
        <div className="flex items-center gap-2">
          <ChainIcon chainId={1} />
          <ChainIcon chainId={10} />
          <ChainIcon chainId={8453} />
          <ChainIcon chainId={42161} />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Size">
        <div className="flex items-center gap-2">
          <ChainIcon chainId={1} size="small" />
          <ChainIcon chainId={1} size="medium" />
          <ChainIcon chainId={1} size="large" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Border">
        <div className="flex items-center gap-2">
          <ChainIcon border chainId={1} size="large" />
          <ChainIcon chainId={1} size="large" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Unknown Chain">
        <div className="flex items-center gap-2">
          <ChainIcon chainId={999999} />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Stack">
        <div className="flex flex-col gap-4">
          <ChainIcon.Stack size="small">
            <ChainIcon chainId={1} />
            <ChainIcon chainId={10} />
            <ChainIcon chainId={8453} />
            <ChainIcon chainId={42161} />
          </ChainIcon.Stack>
          <ChainIcon.Stack size="medium">
            <ChainIcon chainId={1} />
            <ChainIcon chainId={10} />
            <ChainIcon chainId={8453} />
            <ChainIcon chainId={42161} />
          </ChainIcon.Stack>
          <ChainIcon.Stack size="large">
            <ChainIcon chainId={1} />
            <ChainIcon chainId={10} />
            <ChainIcon chainId={8453} />
            <ChainIcon chainId={42161} />
          </ChainIcon.Stack>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
