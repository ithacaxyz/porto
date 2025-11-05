import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import CloudflareTunnel from 'unplugin-cloudflare-tunnel/vite'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import packageJson from './package.json' with { type: 'json' }

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '')

  const plugins: Array<PluginOption> = [
    react(),
    cloudflare(),
    VitePWA({
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
      injectRegister: false,
      manifest: {
        description:
          'An example showcasing authentication with SIWE and Porto in a PWA',
        name: packageJson.name,
        short_name: packageJson.name,
        theme_color: '#ffffff',
      },
      pwaAssets: {
        config: true,
        disabled: false,
      },
      registerType: 'prompt',
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ]

  const enableTunnel =
    env.VITE_ENABLE_TUNNEL === 'true' && config.mode === 'development'

  if (enableTunnel)
    plugins.push(
      CloudflareTunnel({
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: env.CLOUDFLARE_API_TOKEN,
        enabled: true,
        hostname: env.CLOUDFLARE_TUNNEL_HOSTNAME,
        logFile: `logs/${packageJson.name}.log`,
        ssl: env.CLOUDFLARE_TUNNEL_SSL,
        tunnelName: packageJson.name,
      }),
    )

  return {
    plugins,
    server: {
      cors:
        config.mode === 'development'
          ? {
              allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
              ],
              credentials: true,
              methods: ['GET', 'POST', 'OPTIONS'],
              origin: (origin, callback) =>
                callback(null as never, origin ?? true),
              preflightContinue: true,
            }
          : { origin: 'https://id.porto.sh' },
    },
  }
})
