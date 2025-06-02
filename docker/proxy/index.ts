Bun.serve({
  async fetch(req) {
    const body = await req.json()
    const target =
      body.method &&
      (body.method.startsWith('relay_') || body.method === 'health')
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
