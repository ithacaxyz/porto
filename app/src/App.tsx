import { RouterProvider } from '@tanstack/react-router'
import { useAppStore } from './lib/app.ts'
import { usePortoState } from './lib/porto.ts'
import { router } from './lib/router.ts'

export function App() {
  const appState = useAppStore()
  const portoState = usePortoState()
  return <RouterProvider router={router} context={{ appState, portoState }} />
}
