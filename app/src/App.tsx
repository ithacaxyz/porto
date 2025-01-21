import { RouterProvider } from '@tanstack/react-router'
import { usePortoState } from './lib/porto.ts'
import { router } from './lib/router.ts'

export function App() {
  const portoState = usePortoState()
  return <RouterProvider router={router} context={{ portoState }} />
}
