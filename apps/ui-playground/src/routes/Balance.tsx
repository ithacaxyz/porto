import { Balance } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Balance')({
  component: BalanceComponent,
})

function BalanceComponent() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  )

  const handleRefetch = (key: string) => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [key]: false }))
    }, 2000)
  }

  return (
    <ComponentScreen maxWidth={360} title="Balance">
      <ComponentScreen.Section title="Default">
        <div className="flex flex-col gap-4">
          <Balance
            amount="10.5 ETH"
            amountFiat="$3,480.00"
            chainId={42161}
            fetching={loadingStates.eth}
            onRefetch={() => handleRefetch('eth')}
            tokenName="Ethereum"
            tokenSymbol="ETH"
          />
          <Balance
            amount="0.08 WBTC"
            amountFiat="$5,200.00"
            chainId={137}
            fetching={loadingStates.wbtc}
            onRefetch={() => handleRefetch('wbtc')}
            tokenName="Wrapped Bitcoin"
            tokenSymbol="WBTC"
          />
          <Balance
            amount="2,500.00 USDT"
            amountFiat="$2,500.00"
            chainId={8453}
            fetching={loadingStates.usdt}
            onRefetch={() => handleRefetch('usdt')}
            tokenName="Tether USD"
            tokenSymbol="USDT"
          />
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Warn">
        <Balance
          amount="0.12 ETH"
          amountFiat="$396.00"
          chainId={1}
          fetching={loadingStates.warn}
          onRefetch={() => handleRefetch('warn')}
          tokenName="Ethereum"
          tokenSymbol="ETH"
          warn
        />
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Text overflow">
        <Balance
          amount="999,999.123456789123456789 TKN"
          amountFiat="$999,999,999,999,999.99"
          chainId={1}
          fetching={loadingStates.long}
          onRefetch={() => handleRefetch('long')}
          tokenName="Super Long Token Name"
          tokenSymbol="SUPERLONGTOKEN"
        />
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Group">
        <Balance.Group>
          <Balance
            amount="5.2 ETH"
            amountFiat="$17,160.00"
            chainId={1}
            fetching={loadingStates.group1}
            onRefetch={() => handleRefetch('group1')}
            tokenName="Ethereum"
            tokenSymbol="ETH"
          />
          <Balance
            amount="2,000 USDC"
            amountFiat="$2,000.00"
            chainId={1}
            fetching={loadingStates.group2}
            onRefetch={() => handleRefetch('group2')}
            tokenName="USD Coin"
            tokenSymbol="USDC"
          />
          <Balance
            amount="0.5 WBTC"
            amountFiat="$32,500.00"
            chainId={1}
            fetching={loadingStates.group3}
            onRefetch={() => handleRefetch('group3')}
            tokenName="Wrapped Bitcoin"
            tokenSymbol="WBTC"
          />
        </Balance.Group>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
