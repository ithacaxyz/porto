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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Balance
          amount="10.5 ETH"
          amountFiat="$3,480.00"
          chainId={42161}
          loading={loadingStates.eth}
          onRefetch={() => handleRefetch('eth')}
          tokenName="Ethereum"
          tokenSymbol="ETH"
        />
        <Balance
          amount="0.08 WBTC"
          amountFiat="$5,200.00"
          chainId={137}
          loading={loadingStates.wbtc}
          onRefetch={() => handleRefetch('wbtc')}
          tokenName="Wrapped Bitcoin"
          tokenSymbol="WBTC"
        />
        <Balance
          amount="350.00 OP"
          amountFiat="$1.85"
          chainId={10}
          loading={loadingStates.op}
          onRefetch={() => handleRefetch('op')}
          tokenName="Optimism"
          tokenSymbol="OP"
        />
        <Balance
          amount="2,500.00 USDT"
          amountFiat="$1.00"
          chainId={8453}
          loading={loadingStates.usdt}
          onRefetch={() => handleRefetch('usdt')}
          tokenName="Tether USD"
          tokenSymbol="USDT"
        />
        <Balance
          amount="0.12 ETH"
          amountFiat="$396.00"
          chainId={1}
          loading={loadingStates.warn}
          onRefetch={() => handleRefetch('warn')}
          tokenName="Ethereum"
          tokenSymbol="ETH"
          warn
        />
        <Balance
          amount="999,999.123456789123456789 TKN"
          amountFiat="$999,999,999,999,999.99"
          chainId={1}
          loading={loadingStates.long}
          onRefetch={() => handleRefetch('long')}
          tokenName="Super Long Token Name"
          tokenSymbol="SUPERLONGTOKEN"
        />
      </div>
    </ComponentScreen>
  )
}
