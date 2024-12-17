import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'porto',
      environment: 'node',
      include: ['./src/**/*.test.ts'],
    },
  },
])
