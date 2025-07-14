export default defineContentScript({
  async main() {
    const { env } = await browser.storage.local.get('env')

    // Initialize the environment with the inpage entrypoint.
    window.postMessage(
      {
        event: 'init',
        payload: { env },
      },
      '*',
    )

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
