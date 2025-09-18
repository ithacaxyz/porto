import { TokenIcon } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/TokenIcon')({
  component: TokenIconComponent,
})

function TokenIconComponent() {
  return (
    <ComponentScreen title="TokenIcon">
      <ComponentScreen.Section surface="base-alt" title="Default">
        <div className="flex items-center gap-2">
          {['CBBTC', 'ETH', 'EXP2', 'EXP', 'OP', 'USDC', 'USDT', 'WBTC'].map(
            (symbol) => (
              <TokenIcon key={symbol} symbol={symbol} />
            ),
          )}
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Size">
        <div className="flex items-center gap-2">
          <TokenIcon size="small" symbol="ETH" />
          <TokenIcon size="medium" symbol="ETH" />
          <TokenIcon size="large" symbol="ETH" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Border">
        <div className="flex items-center gap-2">
          <TokenIcon border size="large" symbol="ETH" />
          <TokenIcon size="large" symbol="ETH" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Border">
        <div className="flex items-center gap-2">
          <TokenIcon border size="large" symbol="ETH" />
          <TokenIcon size="large" symbol="ETH" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Fallback">
        <div className="flex items-center gap-2">
          <TokenIcon border symbol="MISSING" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Stack">
        <div className="flex flex-col gap-4">
          <TokenIcon.Stack size="small">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
          <TokenIcon.Stack size="medium">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
          <TokenIcon.Stack size="large">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
          <TokenIcon.Stack border={false} gap={8} size="large">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Stack">
        <div className="flex flex-col gap-4">
          <TokenIcon.Stack size="small">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
          <TokenIcon.Stack size="medium">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
          <TokenIcon.Stack size="large">
            <TokenIcon symbol="ETH" />
            <TokenIcon symbol="USDC" />
            <TokenIcon symbol="WBTC" />
            <TokenIcon symbol="OP" />
          </TokenIcon.Stack>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
