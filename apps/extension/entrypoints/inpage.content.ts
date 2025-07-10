import { Porto } from 'porto'

export default defineContentScript({
  main() {
    function init(prod?: boolean) {
      const porto = prod ? Porto.unstable_create() : Porto.create()
      ;(window as any).ethereum = porto.provider
    }

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'init') return
      init(event.data.payload.env === 'prod')
    })

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'trigger-reload') return
      window.location.reload()
    })
  },
  matches: ['https://*/*', 'http://localhost/*'],
  runAt: 'document_end',
  world: 'MAIN',
})
