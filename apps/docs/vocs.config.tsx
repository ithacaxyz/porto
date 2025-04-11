import Icons from 'unplugin-icons/vite'
import Mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vocs'

export default defineConfig({
  description: 'Next-gen Account for Ethereum',
  head() {
    return (
      <>
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=1"
          name="viewport"
        />
      </>
    )
  },
  iconUrl: { dark: '/icon-dark.png', light: '/icon-light.png' },
  logoUrl: { dark: '/logo-dark.svg', light: '/logo-light.svg' },
  rootDir: '.',
  sidebar: {
    '/contracts': [
      {
        link: '/contracts',
        text: 'Overview',
      },
      {
        link: 'https://github.com/ithacaxyz/account',
        text: 'GitHub',
      },
    ],
    '/relay': [
      {
        items: [
          {
            disabled: true,
            link: '/relay/rpc',
            text: 'Overview 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_createAccount',
            text: 'wallet_createAccount 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_getKeys',
            text: 'wallet_getKeys 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_prepareCalls',
            text: 'wallet_prepareCalls 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_prepareUpgradeAccount',
            text: 'wallet_prepareUpgradeAccount 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_sendPreparedCalls',
            text: 'wallet_sendPreparedCalls 🚧',
          },
          {
            disabled: true,
            link: '/relay/rpc/wallet_upgradeAccount',
            text: 'wallet_upgradeAccount 🚧',
          },
        ],
        text: 'RPC Reference',
      },
    ],
    '/sdk': [
      {
        link: '/sdk',
        text: 'Getting Started',
      },
      {
        link: '/demo',
        text: 'Demo',
      },
      {
        link: 'https://github.com/ithacaxyz/porto',
        text: 'GitHub',
      },
      {
        items: [
          {
            disabled: true,
            link: '/sdk/guides/connection',
            text: 'Connecting to Apps 🚧',
          },
          {
            disabled: true,
            link: '/sdk/guides/authentication',
            text: 'Authentication (SIWE) 🚧',
          },
          {
            disabled: true,
            link: '/sdk/guides/payments',
            text: 'Payments 🚧',
          },
          {
            disabled: true,
            link: '/sdk/guides/subscriptions',
            text: 'Subscriptions 🚧',
          },
        ],
        text: 'Guides',
      },
      {
        items: [
          {
            collapsed: false,
            items: [
              {
                link: '/sdk/api/porto/create',
                text: '.create',
              },
            ],
            text: 'Porto',
          },
          {
            disabled: true,
            link: '/sdk/api/chains',
            text: 'Chains 🚧',
          },
          {
            collapsed: true,
            disabled: true,
            items: [
              {
                disabled: true,
                link: '/sdk/api/dialog/iframe',
                text: '.iframe',
              },
              {
                disabled: true,
                link: '/sdk/api/dialog/popup',
                text: '.popup',
              },
            ],
            link: '/sdk/api/dialog',
            text: 'Dialog 🚧',
          },
          {
            collapsed: true,
            disabled: true,
            items: [
              {
                disabled: true,
                link: '/sdk/api/mode/dialog',
                text: '.dialog',
              },
              {
                disabled: true,
                link: '/sdk/api/mode/contract',
                text: '.contract',
              },
              {
                disabled: true,
                link: '/sdk/api/mode/relay',
                text: '.relay',
              },
            ],
            link: '/sdk/api/mode',
            text: 'Mode 🚧',
          },
          {
            collapsed: true,
            disabled: true,
            items: [
              {
                disabled: true,
                link: '/sdk/api/storage/cookie',
                text: '.cookie',
              },
              {
                disabled: true,
                link: '/sdk/api/storage/idb',
                text: '.idb',
              },
              {
                disabled: true,
                link: '/sdk/api/storage/localstorage',
                text: '.localStorage',
              },
              {
                disabled: true,
                link: '/sdk/api/storage/memory',
                text: '.memory',
              },
            ],
            link: '/sdk/api/storage',
            text: 'Storage 🚧',
          },
        ],
        text: 'API Reference',
      },
      {
        items: [
          {
            link: '/sdk/wagmi',
            text: 'Overview',
          },
          {
            collapsed: true,
            disabled: true,
            items: [
              {
                disabled: true,
                link: '/sdk/wagmi/connect',
                text: 'connect',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/createAccount',
                text: 'createAccount',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/disconnect',
                text: 'disconnect',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/grantPermissions',
                text: 'grantPermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/permissions',
                text: 'permissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/revokePermissions',
                text: 'revokePermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/upgradeAccount',
                text: 'upgradeAccount',
              },
            ],
            text: 'Actions 🚧',
          },
          {
            collapsed: true,
            disabled: true,
            items: [
              {
                disabled: true,
                link: '/sdk/wagmi/useConnect',
                text: 'useConnect',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useCreateAccount',
                text: 'useCreateAccount',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useDisconnect',
                text: 'useDisconnect',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useGrantPermissions',
                text: 'useGrantPermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/usePermissions',
                text: 'usePermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useRevokePermissions',
                text: 'useRevokePermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useUpgradeAccount',
                text: 'useUpgradeAccount',
              },
            ],
            text: 'Hooks 🚧',
          },
        ],
        text: 'Wagmi Reference',
      },
      {
        items: [
          {
            link: '/sdk/rpc',
            text: 'Overview',
          },
          {
            link: '/sdk/rpc/eth_accounts',
            text: 'eth_accounts',
          },
          {
            link: '/sdk/rpc/eth_requestAccounts',
            text: 'eth_requestAccounts',
          },
          {
            link: '/sdk/rpc/eth_sendTransaction',
            text: 'eth_sendTransaction',
          },
          {
            link: '/sdk/rpc/eth_signTypedData_V4',
            text: 'eth_signTypedData_V4',
          },
          {
            link: '/sdk/rpc/experimental_createAccount',
            text: 'experimental_createAccount',
          },
          {
            link: '/sdk/rpc/experimental_getAccountVersion',
            text: 'experimental_getAccountVersion',
          },
          {
            link: '/sdk/rpc/experimental_getAdmins',
            text: 'experimental_getAdmins',
          },
          {
            link: '/sdk/rpc/experimental_getPermissions',
            text: 'experimental_getPermissions',
          },
          {
            link: '/sdk/rpc/experimental_grantAdmin',
            text: 'experimental_grantAdmin',
          },
          {
            link: '/sdk/rpc/experimental_grantPermissions',
            text: 'experimental_grantPermissions',
          },
          {
            link: '/sdk/rpc/experimental_revokeAdmin',
            text: 'experimental_revokeAdmin',
          },
          {
            link: '/sdk/rpc/experimental_revokePermissions',
            text: 'experimental_revokePermissions',
          },
          {
            link: '/sdk/rpc/personal_sign',
            text: 'personal_sign',
          },
          {
            link: '/sdk/rpc/wallet_connect',
            text: 'wallet_connect',
          },
          {
            link: '/sdk/rpc/wallet_disconnect',
            text: 'wallet_disconnect',
          },
          {
            link: '/sdk/rpc/wallet_getCapabilities',
            text: 'wallet_getCapabilities',
          },
          {
            link: '/sdk/rpc/wallet_getCallsStatus',
            text: 'wallet_getCallsStatus',
          },
          {
            link: '/sdk/rpc/wallet_prepareCalls',
            text: 'wallet_prepareCalls',
          },
          {
            link: '/sdk/rpc/wallet_sendCalls',
            text: 'wallet_sendCalls',
          },
          {
            link: '/sdk/rpc/wallet_sendPreparedCalls',
            text: 'wallet_sendPreparedCalls',
          },
        ],
        text: 'RPC Reference',
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
  title: 'Porto',
  topNav: [
    {
      link: '/sdk',
      text: 'SDK',
    },
    {
      link: '/relay/rpc',
      text: 'Relay',
    },
    {
      link: '/contracts',
      text: 'Contracts',
    },
  ],
  vite: {
    plugins: [
      Mkcert({
        hosts: [
          'localhost',
          'stg.localhost',
          process.env.ANVIL === 'true' ? 'anvil.localhost' : '',
        ],
      }),
      Icons({ compiler: 'jsx', jsx: 'react' }) as never,
    ],
    server: {
      proxy: {},
    },
  },
})
