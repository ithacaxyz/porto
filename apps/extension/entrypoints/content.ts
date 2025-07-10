import { Porto } from 'porto'

export default defineContentScript({
  main() {
    const porto = Porto.unstable_create()
    ;(window as any).ethereum = porto.provider
  },
  matches: ['https://*/*', 'http://localhost/*'],
  runAt: 'document_end',
  world: 'MAIN',
})
