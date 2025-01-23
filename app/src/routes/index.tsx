import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { IndeterminateLoader } from '../components/IndeterminateLoader'
import { useRequestsStore } from '../lib/requests'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [request, reject, respond] = useRequestsStore(
    (state) => [state.requests[0], state.reject, state.respond] as const,
  )
  const [loading, setLoading] = React.useState(false)

  if (loading)
    return (
      <div className="flex flex-grow flex-col justify-center">
        <IndeterminateLoader title="Responding" />
      </div>
    )

  return (
    <div className="flex flex-grow flex-col justify-between p-3">
      <Header
        title="Method Not implemented"
        icon={LucideTriangleAlert}
        content={
          <>
            UI support for method "{request?.request?.method}" is not
            implemented yet. You may still proceed by rejecting or responding.
          </>
        }
        variant="warning"
      />

      <pre className="my-2.5 overflow-x-scroll rounded-lg border border-blackA1 bg-blackA1 p-3 text-[14px] text-gray12 leading-[22px] dark:border-whiteA1 dark:bg-whiteA1">
        {JSON.stringify(request?.request ?? {}, null, 2)}
      </pre>

      <div className="flex gap-2">
        <Button
          className="flex-grow"
          type="button"
          onClick={() => reject(request!)}
        >
          Reject
        </Button>

        <Button
          className="flex-grow"
          type="button"
          variant="primary"
          onClick={() => {
            setLoading(true)
            respond(request!).then(() => setTimeout(() => setLoading(false)))
          }}
        >
          Respond
        </Button>
      </div>
    </div>
  )
}
