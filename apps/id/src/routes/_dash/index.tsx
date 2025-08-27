import { createFileRoute } from '@tanstack/react-router'
import { useDisconnect } from 'wagmi'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const disconnect = useDisconnect()
  return (
    <div>
      <div> Hello "/(dash)/"!</div>
      <button onClick={() => disconnect.disconnect()} type="button">
        disconnect
      </button>
    </div>
  )
}
