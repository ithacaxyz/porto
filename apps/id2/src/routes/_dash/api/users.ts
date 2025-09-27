import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/api/users')({
  server: {
    handlers: {
      GET: async (_) => {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = (await res.json()) as Array<any>
        return Response.json(data)
      },
    },
  },
})
