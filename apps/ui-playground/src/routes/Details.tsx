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
            <Details.Item
              label="Networks"
              value={<ChainsPath chainIds={[10, 1]} />}
            />
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Multiple rows">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key}>
            <Details.Item
              label="Network"
              value={<ChainsPath chainIds={[10, 42161, 1]} />}
            />
            <Details.Item label="Gas fee" value="$2.45" />
            <Details.Item label="Total" value="$102.45" />
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
            <Details.Item
              label="Network"
              value={<ChainsPath chainIds={[10, 42161, 1]} />}
            />
            <Details.Item label="Gas fee" value="$2.45" />
          </Details>
        </div>
      </ComponentScreen.Section>

      <ComponentScreen.Section title="Start opened">
        <div className="flex flex-col gap-2 rounded-lg bg-th_base p-3">
          <Details key={key} opened>
            <Details.Item
              label="Network"
              value={<ChainsPath chainIds={[10, 42161, 1]} />}
            />
            <Details.Item label="Gas fee" value="$2.45" />
            <Details.Item label="Total" value="$102.45" />
          </Details>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
