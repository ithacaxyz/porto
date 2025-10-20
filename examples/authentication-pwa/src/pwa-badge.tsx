import { useRegisterSW } from 'virtual:pwa-register/react'
import * as React from 'react'

function PWABadge() {
  // periodic sync is disabled, change the value to enable it, the period is in milliseconds
  // You can remove onRegisteredSW callback and registerPeriodicSync function
  const period = 0

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated') registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  const id = React.useId()

  function close() {
    setNeedRefresh(false)
  }

  return (
    <div aria-labelledby="toast-message" className="PWABadge" role="alert">
      {needRefresh && (
        <div className="PWABadge-toast">
          <div className="PWABadge-message">
            <span id={id}>
              New content available, click on reload button to update.
            </span>
          </div>
          <div className="PWABadge-buttons">
            <button
              className="PWABadge-toast-button"
              onClick={() => updateServiceWorker(true)}
              type="button"
            >
              Reload
            </button>
            <button
              className="PWABadge-toast-button"
              onClick={() => close()}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200) await r.update()
  }, period)
}
