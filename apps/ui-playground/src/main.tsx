import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.js'
import './styles.css'

import '@porto/ui/styles.css'

const rootElement = document.querySelector('div#root')

if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
