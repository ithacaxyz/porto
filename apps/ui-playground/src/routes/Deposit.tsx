import { Deposit } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Deposit')({
  component: DepositComponent,
})

const demoAddress = '0x95223290dd7278aa1ddd389cc1e1d165cc1bafe5'

function DepositComponent() {
  return (
    <ComponentScreen title="Deposit">
      <ComponentScreen.Section title="Base">
        <div className="flex max-w-xs flex-col gap-4 rounded-lg bg-th_base p-3">
          <Deposit address={demoAddress} label="Deposit crypto" />
          <Deposit address={demoAddress} label="Send funds to" />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
