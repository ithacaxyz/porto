import { hc } from 'hono/client'
import type { onrampApp } from '#routes/onramp.ts'

const [, , route] = process.argv as [
  string,
  string,
  'external' | 'global' | 'us',
]

/**
 * run with: `node --env-file='.env' ./scripts/onramp.ts`
 */

const unixTimestamp = Date.now()

const url = `http://localhost:${process.env.PORT}/onramp`
const client = hc<typeof onrampApp>(url)

main().catch(console.error)

async function main() {
  if (route === 'us') {
    const response = await client.us.$post({
      json: {
        address: '0x1234567890123456789012345678901234567890',
        amount: '40',
        email: `${unixTimestamp}@test.com`,
        phone: '(+1)6086666666',
      },
    })
    console.info(await response.json())
  }

  if (route === 'global') {
    const response = await client.global.$get({
      query: {
        address: '0x2fffc2a6ded03b2eeab6ec3734a032542638138f',
        amount: '55',
        email: `${unixTimestamp}@test.com`,
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
  }
}
