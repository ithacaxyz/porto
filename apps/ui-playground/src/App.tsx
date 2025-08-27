import { Ui } from '@porto/ui'
import { RouterProvider } from '@tanstack/react-router'
import { ColorSchemeProvider } from './ColorScheme'
import { router } from './router'

export function App() {
  return (
    <ColorSchemeProvider>
      <Ui assetsBaseUrl="/ui">
        <RouterProvider router={router} />
      </Ui>
    </ColorSchemeProvider>
  )
}
