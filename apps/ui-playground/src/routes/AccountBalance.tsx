import { AccountBalance } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/AccountBalance')({
  component: AccountBalanceComponent,
})

function AccountBalanceComponent() {
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
    <ComponentScreen maxWidth={360} title="AccountBalance">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AccountBalance
          amount="10.5 ETH"
          chainId={42161}
          loading={loadingStates.eth}
          onRefetch={() => handleRefetch('eth')}
          amountFiat="$3,480.00"
          tokenSymbol="ETH"
          tokenName="Ethereum"
        />
        <AccountBalance
          amount="0.08 WBTC"
          chainId={137}
          loading={loadingStates.wbtc}
          onRefetch={() => handleRefetch('wbtc')}
          amountFiat="$5,200.00"
          tokenSymbol="WBTC"
          tokenName="Wrapped Bitcoin"
        />
        <AccountBalance
          amount="350.00 OP"
          chainId={10}
          loading={loadingStates.op}
          onRefetch={() => handleRefetch('op')}
          amountFiat="$1.85"
          tokenSymbol="OP"
          tokenName="Optimism"
        />
        <AccountBalance
          amount="2,500.00 USDT"
          chainId={8453}
          loading={loadingStates.usdt}
          onRefetch={() => handleRefetch('usdt')}
          amountFiat="$1.00"
          tokenSymbol="USDT"
          tokenName="Tether USD"
        />
      </div>
    </ComponentScreen>
  )
}
