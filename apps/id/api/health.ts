export default {
  fetch: async (request: Request) => {
    const url = new URL(request.url)

    console.info(`Request to ${url.pathname}`)

    return new Response('OK', { status: 200 })
  },
}
