import { DiscIcon } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/DiscIcon')({
  component: DiscIconComponent,
})

function DiscIconComponent() {
  return (
    <ComponentScreen title="DiscIcon">
      <ComponentScreen.Section surface="base-alt" title="Default">
        <div className="flex items-center gap-2">
          <DiscIcon src="/ui/token-icons/eth.svg" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Size">
        <div className="flex items-center gap-2">
          <DiscIcon size="small" src="/ui/token-icons/usdc.svg" />
          <DiscIcon size="medium" src="/ui/token-icons/usdc.svg" />
          <DiscIcon size="large" src="/ui/token-icons/usdc.svg" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Border">
        <div className="flex items-center gap-2">
          <DiscIcon border size="large" src="/ui/token-icons/eth.svg" />
          <DiscIcon size="large" src="/ui/token-icons/eth.svg" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Fallback">
        <div className="flex items-center gap-2">
          <DiscIcon
            border
            fallback="/ui/token-icons/fallback.svg"
            src="/invalid-path.svg"
          />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Stack">
        <div className="flex flex-col gap-4">
          <DiscIcon.Stack size="small">
            <DiscIcon src="/ui/token-icons/eth.svg" />
            <DiscIcon src="/ui/token-icons/usdc.svg" />
            <DiscIcon src="/ui/token-icons/wbtc.svg" />
            <DiscIcon src="/ui/token-icons/op.svg" />
          </DiscIcon.Stack>
          <DiscIcon.Stack size="medium">
            <DiscIcon src="/ui/token-icons/eth.svg" />
            <DiscIcon src="/ui/token-icons/usdc.svg" />
            <DiscIcon src="/ui/token-icons/wbtc.svg" />
            <DiscIcon src="/ui/token-icons/op.svg" />
          </DiscIcon.Stack>
          <DiscIcon.Stack size="large">
            <DiscIcon src="/ui/token-icons/eth.svg" />
            <DiscIcon src="/ui/token-icons/usdc.svg" />
            <DiscIcon src="/ui/token-icons/wbtc.svg" />
            <DiscIcon src="/ui/token-icons/op.svg" />
          </DiscIcon.Stack>
          <DiscIcon.Stack border={false} gap={8} size="large">
            <DiscIcon src="/ui/token-icons/eth.svg" />
            <DiscIcon src="/ui/token-icons/usdc.svg" />
            <DiscIcon src="/ui/token-icons/wbtc.svg" />
            <DiscIcon src="/ui/token-icons/op.svg" />
          </DiscIcon.Stack>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
