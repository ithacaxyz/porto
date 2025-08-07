import { describe, expect, test } from 'vitest'
import { Router } from './Router.js'

describe('create', () => {
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
})
