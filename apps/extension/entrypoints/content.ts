export default defineContentScript({
  async main() {
    browser.storage.local.onChanged.addListener((changes) => {
      // If user has selected to change environment, trigger a browser reload to
      // reinstantiate Porto.
      if (changes.env)
        window.postMessage(
          {
            event: 'trigger-reload',
          },
          '*',
        )
    })
  },
  matches: ['https://*/*', 'http://localhost/*'],
})
