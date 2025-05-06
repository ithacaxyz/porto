import { RpcRequest } from 'ox'
import { describe, expect, test } from 'vitest'
import * as Sponsor from './Sponsor.js'

const store = RpcRequest.createStore()

describe('rpcHandler', () => {
  test('default', async () => {
    const handler = Sponsor.rpcHandler()
    const request = new Request('http://localhost:3000/rpc', {
      body: JSON.stringify({
        jsonrpc: '2.0',
      }),
      method: 'POST',
    })
    const response = await handler(request)
    expect(response).toBeNull()
  })
})
