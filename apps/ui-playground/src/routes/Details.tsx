import { Button, ChainsPath, Details } from '@porto/ui'
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
      maxWidth={360}
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
              <div className="text-th_base-secondary">Networks</div>
              <ChainsPath chainIds={[10, 1]} />
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Multiple rows">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key}>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Network</div>
              <ChainsPath chainIds={[10, 42161, 1]} />
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Gas fee</div>
              <div className="font-medium">$2.45</div>
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Total</div>
              <div className="font-medium">$102.45</div>
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
              <div className="text-th_base-secondary">Network</div>
              <ChainsPath chainIds={[10, 42161, 1]} />
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Gas fee</div>
              <div className="font-medium">$2.45</div>
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Start opened">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key} opened>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Network</div>
              <ChainsPath chainIds={[10, 42161, 1]} />
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Gas fee</div>
              <div className="font-medium">$2.45</div>
            </div>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <div className="text-th_base-secondary">Total</div>
              <div className="font-medium">$102.45</div>
            </div>
          </Details>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
