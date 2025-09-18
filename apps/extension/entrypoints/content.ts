export default defineContentScript({
  async main() {
    browser.storage.local.onChanged.addListener((changes) => {
      // If user has selected to change environment, trigger a browser reload to
      // reinstantiate Porto.
      if (changes.env)
        window.postMessage(
          {
            // New namespaced event type
            type: 'porto:trigger-reload',
            // Backward-compat field; can be removed later
            event: 'trigger-reload',
            // Optional nonce for basic validation if listener expects it
            nonce: (() => {
              try {
                return sessionStorage.getItem('porto:reload:nonce')
              } catch {
                return undefined
              }
            })(),
          },
          window.location.origin,
        )
    })
  },
  matches: ['https://*/*', 'http://localhost/*'],
})
