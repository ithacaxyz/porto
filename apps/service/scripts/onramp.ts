import { hc } from 'hono/client'
import type { onrampApp } from '#routes/onramp.ts'

/**
 * run with: `node --env-file='.env' ./scripts/onramp.ts`
 */

const unixTimestamp = Date.now()

const url = `http://localhost:${process.env.PORT}/onramp`
const client = hc<typeof onrampApp>(url)
const response = await client.index.$get({
  query: {
    address: '0x1234567890123456789012345678901234567890',
    amount: '40',
    email: `${unixTimestamp}@porto.mail`,
    environment: 'production',
    redirect: 'false', // true will redirect to an HTML page
  },
})

try {
  const contentType = response.headers.get('content-type')
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text()
  console.info(data)
} catch (error) {
  console.error(error)
} finally {
  console.info(response.status, response.statusText)
}
