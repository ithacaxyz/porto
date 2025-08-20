import { Dialog, Mode, Porto } from 'porto'

export default defineContentScript({
  main() {
    const porto = Porto.create()
    ;(window as any).ethereum = porto.provider

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'trigger-reload') return
      window.location.reload()
    })

    document.addEventListener('securitypolicyviolation', (event) => {
      if (!event.blockedURI.includes('porto.sh')) return

      const mode = porto?._internal.getMode() as ReturnType<typeof Mode.dialog>

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
