Bun.serve({
  async fetch(request) {
    if (request.method === 'GET') return new Response('Nada')

    const body = await request.json()
    const target =
      body.method &&
      (body.method.startsWith('wallet_') || body.method === 'health')
        ? Bun.env.RELAY_URL!
        : Bun.env.ANVIL_URL!
    return fetch(target, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  },
  port: Number(Bun.env.PORT!),
})
