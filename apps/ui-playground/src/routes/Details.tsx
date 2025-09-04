import { Button, Details } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Details')({
  component: DetailsComponent,
})

function DetailsComponent() {
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState(0)
  return (
    <ComponentScreen
      title={
        <>
          <div>Details</div>
          <Button
            onClick={() => {
              setKey((v) => v + 1)
              setLoading(true)
            }}
            size="small"
          >
            Reset
          </Button>
        </>
      }
    >
      <ComponentScreen.Section title="Basic usage">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key}>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Network</span>
              <span className="font-medium">Ethereum</span>
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Multiple rows">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key}>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Network</span>
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Gas fee</span>
              <span className="font-medium">$2.45</span>
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Total</span>
              <span className="font-medium">$102.45</span>
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section
        title={
          <>
            <div>Loading state</div>
            <Button onClick={() => setLoading((v) => !v)} size="small">
              {loading ? 'on' : 'off'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key} loading={loading}>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Network</span>
              <span className="font-medium">Ethereum</span>
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Gas fee</span>
              <span className="font-medium">$2.45</span>
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
