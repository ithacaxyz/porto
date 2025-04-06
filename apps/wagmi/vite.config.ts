import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  define:
    process.env.NODE_ENV === 'development'
      ? {
          'import.meta.env.VITE_DIALOG_HOST': JSON.stringify(
            'https://localhost:5174/dialog/',
          ),
        }
      : undefined,
  plugins: [mkcert(), react()],
})
