import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.js'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <meta content={__APP_VERSION__} name="x-app-version" />
    <App />
  </React.StrictMode>,
)

if (import.meta.env.VERCEL_ENV !== 'production')
  import('eruda').then(({ default: eruda }) => eruda.init())
