import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.js'
import { appStore } from './lib/app.ts'
import { messenger } from './lib/porto.js'
import { requestsStore } from './lib/requests.js'
import { router } from './lib/router.ts'

import './index.css'

messenger.ready()
const unsubscribe_internal = messenger.on('__internal', (payload) => {
  if (payload.type === 'init') appStore.setState(payload)
})
const unsubscribe_rpc = messenger.on('rpc-requests', (payload) => {
  const requests = payload as requestsStore.State['requests']
  requestsStore.setState({ requests })
  handle_rpc(requests)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.hot)
  import.meta.hot.on('vite:beforeUpdate', () => {
    unsubscribe_internal()
    unsubscribe_rpc()
  })

function handle_rpc(requests: requestsStore.State['requests']) {
  const request = requests[0]?.request
  const search: Parameters<(typeof router)['navigate']>[0]['search'] = (prev) =>
    prev as never

  if (request?.method === 'wallet_connect') {
    const capabilities = request.params?.[0]?.capabilities ?? {}
    if (capabilities.createAccount) router.navigate({ to: '/register', search })
    else router.navigate({ to: '/login', search })
  } else {
    router.navigate({ to: '/', search })
  }
}
