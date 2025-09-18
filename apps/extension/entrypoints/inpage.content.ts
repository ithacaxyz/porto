import { Dialog, Mode, Porto } from 'porto'

export default defineContentScript({
  main() {
    const porto = Porto.create({
      announceProvider: {
        name: 'Porto (Extension)',
        rdns: 'xyz.ithaca.porto.ext',
      },
    })
    ;(window as any).ethereum = porto.provider

    window.addEventListener('message', (event) => {
      // Accept only same-window, same-origin messages
      if (event.source !== window) return
      if (event.origin !== window.location.origin) return

      const data = event.data
      if (!data) return

      // Backward compatibility for legacy format { event: 'trigger-reload' }
      const isLegacy = data && data.event === 'trigger-reload'
      const isNamespaced = data && data.type === 'porto:trigger-reload'

      if (!isLegacy && !isNamespaced) return

      // Optional lightweight CSRF: verify a nonce if present
      try {
        const expected = sessionStorage.getItem('porto:reload:nonce')
        if (data.nonce && expected && data.nonce !== expected) return
      } catch {}

      window.location.reload()
    })

    document.addEventListener('securitypolicyviolation', (event) => {
      if (
        event.blockedURI.indexOf('id.porto.sh') === -1 &&
        event.blockedURI.indexOf('preview.porto.sh') === -1
      )
        return

      const mode = porto?._internal.getMode() as ReturnType<typeof Mode.dialog>

      porto._internal.store.setState((x) => ({
        ...x,
        requestQueue: [],
      }))
      porto?._internal.setMode(
        Mode.dialog({
          host: mode.config.host,
          renderer: Dialog.popup(),
        }),
      )
    })
  },
  matches: ['https://*/*', 'http://localhost/*'],
  runAt: 'document_end',
  world: 'MAIN',
})
