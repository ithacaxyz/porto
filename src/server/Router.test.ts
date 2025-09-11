import { expect, test } from 'vitest'
import * as Key from '../viem/Key.js'
import * as Route from './Route.js'
import { Router } from './Router.js'

test('default', async () => {
  const router = Router()
  const response = await router.hono.request('http://localhost')

  expect(response.status).toBe(200)
  expect(response.headers.get('access-control-allow-origin')).toBe('*')
  expect(await response.text()).toMatchInlineSnapshot(`
      "
      █▀█ █▀█ █▀█ ▀█▀ █▀█
      █▀▀ █▄█ █▀▄  █  █▄█
      "
    `)
})

test('behavior: route', async () => {
  const key = Key.createSecp256k1()
  const router = Router().route(
    '/merchant',
    Route.merchant({
      address: '0x0000000000000000000000000000000000000000',
      key: key.privateKey!(),
    }),
  )
  const response = await router.hono.request('http://localhost/merchant')
  expect(response.status).toBe(200)
  expect(await response.text()).toMatchInlineSnapshot(`"ok"`)
})
