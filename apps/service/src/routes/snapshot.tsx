import { Hono } from 'hono'
import { html } from 'hono/html'

const snapshotApp = new Hono()

snapshotApp.get('/', async (context) => {
  return context.html(
    <html lang="en" style="font-family:monospace;">
      <head>
        {html /* js */`<script type="module">
            import { UAParser } from "https://esm.sh/ua-parser-js"

            const { ua: _, ...ua } = UAParser(navigator.userAgent)
            const fieldElement = document.querySelector('pre[data-name="field"]')
            fieldElement.textContent = JSON.stringify(ua, undefined, 2)

            const copyElement = document.querySelector('button[data-name="copy"]')
            copyElement.addEventListener('click', () => {
              navigator.clipboard.writeText(fieldElement.textContent)
              .then(() => {
                copyElement.textContent = 'COPIED'
                setTimeout(() => copyElement.textContent = 'COPY', 2_000)
              })
            })
          </script>`}
      </head>
      <body>
        <button data-name="copy" type="button">
          COPY
        </button>
        <strong>{' -> '}</strong>
        <span>
          then submit a report at{' '}
          <a
            href="https://github.com/ithacaxyz/porto/issues"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/ithacaxyz/porto/issues
          </a>
        </span>
        <hr />
        <pre data-name="field" />
      </body>
    </html>,
  )
})

export { snapshotApp }
