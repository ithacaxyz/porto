import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vocs'

const https = {
  key: resolve(import.meta.dirname, '../localhost-key.pem'),
  cert: resolve(import.meta.dirname, '../localhost.pem'),
} as const
const enableHttps = existsSync(https.cert) && existsSync(https.key)

export default defineConfig({
  rootDir: '.',
  title: 'Porto',
  description: 'Next-gen Account for Ethereum',
  iconUrl: { light: '/icon-light.png', dark: '/icon-dark.png' },
  logoUrl: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
  sidebar: {
    '/sdk': [
      {
        text: 'Getting Started',
        link: '/sdk',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/ithacaxyz/porto',
      },
      {
        text: 'Guides',
        items: [
          {
            text: 'Connecting to Apps 🚧',
            disabled: true,
            link: '/sdk/guides/connection',
          },
          {
            text: 'Authentication (SIWE) 🚧',
            disabled: true,
            link: '/sdk/guides/authentication',
          },
          {
            text: 'Payments 🚧',
            disabled: true,
            link: '/sdk/guides/payments',
          },
          {
            text: 'Subscriptions 🚧',
            disabled: true,
            link: '/sdk/guides/subscriptions',
          },
        ],
      },
      {
        text: 'API Reference',
        items: [
          {
            text: 'Porto',
            collapsed: false,
            items: [
              {
                text: '.create',
                link: '/sdk/api/porto/create',
              },
            ],
          },
          {
            text: 'Chains 🚧',
            disabled: true,
            link: '/sdk/api/chains',
          },
          {
            text: 'Dialog 🚧',
            collapsed: true,
            disabled: true,
            link: '/sdk/api/dialog',
            items: [
              {
                text: '.iframe',
                disabled: true,
                link: '/sdk/api/dialog/iframe',
              },
              {
                text: '.popup',
                disabled: true,
                link: '/sdk/api/dialog/popup',
              },
            ],
          },
          {
            text: 'Implementation 🚧',
            collapsed: true,
            disabled: true,
            link: '/sdk/api/implementation',
            items: [
              {
                text: '.dialog',
                disabled: true,
                link: '/sdk/api/implementation/dialog',
              },
              {
                text: '.local',
                disabled: true,
                link: '/sdk/api/implementation/local',
              },
            ],
          },
          {
            text: 'Storage 🚧',
            collapsed: true,
            disabled: true,
            link: '/sdk/api/storage',
            items: [
              {
                text: '.cookie',
                disabled: true,
                link: '/sdk/api/storage/cookie',
              },
              {
                text: '.idb',
                disabled: true,
                link: '/sdk/api/storage/idb',
              },
              {
                text: '.localStorage',
                disabled: true,
                link: '/sdk/api/storage/localstorage',
              },
              {
                text: '.memory',
                disabled: true,
                link: '/sdk/api/storage/memory',
              },
            ],
          },
        ],
      },
      {
        text: 'Wagmi Reference',
        items: [
          {
            text: 'Overview',
            link: '/sdk/wagmi',
          },
          {
            text: 'Actions 🚧',
            disabled: true,
            collapsed: true,
            items: [
              {
                text: 'connect',
                disabled: true,
                link: '/sdk/wagmi/connect',
              },
              {
                text: 'createAccount',
                disabled: true,
                link: '/sdk/wagmi/createAccount',
              },
              {
                text: 'disconnect',
                disabled: true,
                link: '/sdk/wagmi/disconnect',
              },
              {
                text: 'grantPermissions',
                disabled: true,
                link: '/sdk/wagmi/grantPermissions',
              },
              {
                text: 'permissions',
                disabled: true,
                link: '/sdk/wagmi/permissions',
              },
              {
                text: 'revokePermissions',
                disabled: true,
                link: '/sdk/wagmi/revokePermissions',
              },
              {
                text: 'upgradeAccount',
                disabled: true,
                link: '/sdk/wagmi/upgradeAccount',
              },
            ],
          },
          {
            text: 'Hooks 🚧',
            collapsed: true,
            disabled: true,
            items: [
              {
                text: 'useConnect',
                disabled: true,
                link: '/sdk/wagmi/useConnect',
              },
              {
                text: 'useCreateAccount',
                disabled: true,
                link: '/sdk/wagmi/useCreateAccount',
              },
              {
                text: 'useDisconnect',
                disabled: true,
                link: '/sdk/wagmi/useDisconnect',
              },
              {
                text: 'useGrantPermissions',
                disabled: true,
                link: '/sdk/wagmi/useGrantPermissions',
              },
              {
                text: 'usePermissions',
                disabled: true,
                link: '/sdk/wagmi/usePermissions',
              },
              {
                text: 'useRevokePermissions',
                disabled: true,
                link: '/sdk/wagmi/useRevokePermissions',
              },
              {
                text: 'useUpgradeAccount',
                disabled: true,
                link: '/sdk/wagmi/useUpgradeAccount',
              },
            ],
          },
        ],
      },
      {
        text: 'RPC Reference',
        items: [
          {
            text: 'Overview',
            link: '/sdk/rpc',
          },
          {
            text: 'eth_accounts',
            link: '/sdk/rpc/eth_accounts',
          },
          {
            text: 'eth_requestAccounts',
            link: '/sdk/rpc/eth_requestAccounts',
          },
          {
            text: 'eth_sendTransaction',
            link: '/sdk/rpc/eth_sendTransaction',
          },
          {
            text: 'eth_signTypedData_V4',
            link: '/sdk/rpc/eth_signTypedData_V4',
          },
          {
            text: 'experimental_createAccount',
            link: '/sdk/rpc/experimental_createAccount',
          },
          {
            text: 'experimental_grantPermissions',
            link: '/sdk/rpc/experimental_grantPermissions',
          },
          {
            text: 'experimental_permissions',
            link: '/sdk/rpc/experimental_permissions',
          },
          {
            text: 'experimental_revokePermissions',
            link: '/sdk/rpc/experimental_revokePermissions',
          },
          {
            text: 'personal_sign',
            link: '/sdk/rpc/personal_sign',
          },
          {
            text: 'wallet_connect',
            link: '/sdk/rpc/wallet_connect',
          },
          {
            text: 'wallet_disconnect',
            link: '/sdk/rpc/wallet_disconnect',
          },
          {
            text: 'wallet_getCapabilities',
            link: '/sdk/rpc/wallet_getCapabilities',
          },
          {
            text: 'wallet_getCallsStatus',
            link: '/sdk/rpc/wallet_getCallsStatus',
          },
          {
            text: 'wallet_prepareCalls',
            link: '/sdk/rpc/wallet_prepareCalls',
          },
          {
            text: 'wallet_sendCalls',
            link: '/sdk/rpc/wallet_sendCalls',
          },
          {
            text: 'wallet_sendPreparedCalls',
            link: '/sdk/rpc/wallet_sendPreparedCalls',
          },
        ],
      },
    ],
    '/relay': [
      {
        text: 'RPC Reference',
        items: [
          {
            text: 'Overview 🚧',
            disabled: true,
            link: '/relay/rpc',
          },
          {
            text: 'wallet_createAccount 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_createAccount',
          },
          {
            text: 'wallet_getKeys 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_getKeys',
          },
          {
            text: 'wallet_prepareCalls 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_prepareCalls',
          },
          {
            text: 'wallet_prepareUpgradeAccount 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_prepareUpgradeAccount',
          },
          {
            text: 'wallet_sendPreparedCalls 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_sendPreparedCalls',
          },
          {
            text: 'wallet_upgradeAccount 🚧',
            disabled: true,
            link: '/relay/rpc/wallet_upgradeAccount',
          },
        ],
      },
    ],
    '/contracts': [
      {
        text: 'Overview',
        link: '/contracts',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/ithacaxyz/account',
      },
    ],
  },
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/ithacaxyz/porto',
    },
    {
      icon: 'x',
      link: 'https://x.com/ithacaxyz',
    },
  ],
  topNav: [
    {
      text: 'SDK',
      link: '/sdk',
    },
    {
      text: 'Relay',
      link: '/relay/rpc',
    },
    {
      text: 'Contracts',
      link: '/contracts',
    },
  ],
  vite: {
    define:
      process.env.NODE_ENV === 'development'
        ? {
            'import.meta.env.VITE_DIALOG_HOST': JSON.stringify(
              (enableHttps ? 'https' : 'http') + '://localhost:5174/dialog',
            ),
          }
        : undefined,
    plugins: [Icons({ compiler: 'jsx', jsx: 'react' }) as never],
    server: {
      https: enableHttps ? https : undefined,
      proxy: {},
    },
  },
})
