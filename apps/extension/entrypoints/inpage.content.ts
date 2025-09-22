import { Dialog, Mode, Porto } from 'porto'

export default defineContentScript({
  main() {
    const porto = Porto.create({
      announceProvider: {
        name: 'Porto (Extension)',
        rdns: 'xyz.ithaca.porto.ext',
      },
      mode: Mode.dialog({
        host: import.meta.env.VITE_DIALOG_HOST,
      }),
    })
    ;(window as any).ethereum = porto.provider

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'trigger-reload') return
      window.location.reload()
    })

    document.addEventListener('securitypolicyviolation', (event) => {
      if (
        !event.blockedURI.includes('id.porto.sh') &&
        !event.blockedURI.includes('preview.porto.sh')
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
