import { RouterProvider } from '@tanstack/react-router'
import { ColorSchemeProvider } from './ColorScheme'
import { router } from './router'

export function App() {
  return (
    <ColorSchemeProvider>
      <RouterProvider router={router} />
    </ColorSchemeProvider>
  )
}
