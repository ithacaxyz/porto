import { TokenIcon } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/TokenIcon')({
  component: TokenIconComponent,
})

function TokenIconComponent() {
  return (
    <ComponentScreen title="TokenIcon">
      <ComponentScreen.Section surface="base-alt" title="Tokens">
        <div className="flex items-center gap-1">
          {['CBBTC', 'ETH', 'EXP', 'EXP2', 'OP', 'USDC', 'USDT', 'WBTC'].map(
            (symbol) => (
              <TokenIcon symbol={symbol} />
            ),
          )}
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Size">
        <div className="flex items-center gap-1">
          <TokenIcon size="medium" symbol="ETH" />
          <TokenIcon size="large" symbol="ETH" />
          <TokenIcon size={40} symbol="ETH" />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section surface="base-alt" title="Fallback">
        <div className="flex items-center gap-1">
          <TokenIcon symbol="MISSING" />
          <TokenIcon />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
