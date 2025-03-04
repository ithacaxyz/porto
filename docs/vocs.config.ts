import { defineConfig } from 'vocs'

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
            text: 'Connecting to Apps',
            link: '/sdk/guides/connection',
          },
          {
            text: 'Authentication (SIWE)',
            link: '/sdk/guides/authentication',
          },
          {
            text: 'Payments',
            link: '/sdk/guides/payments',
          },
          {
            text: 'Subscriptions',
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
            link: '/sdk/api/porto',
            items: [
              {
                text: '.create',
                link: '/sdk/api/porto/create',
              },
            ],
          },
          {
            text: 'Chains',
            link: '/sdk/api/chains',
          },
          {
            text: 'Dialog',
            collapsed: true,
            link: '/sdk/api/dialog',
            items: [
              {
                text: '.iframe',
                link: '/sdk/api/dialog/iframe',
              },
              {
                text: '.popup',
                link: '/sdk/api/dialog/popup',
              },
            ],
          },
          {
            text: 'Implementation',
            collapsed: true,
            link: '/sdk/api/implementation',
            items: [
              {
                text: '.dialog',
                link: '/sdk/api/implementation/dialog',
              },
              {
                text: '.local',
                link: '/sdk/api/implementation/local',
              },
            ],
          },
          {
            text: 'Storage',
            collapsed: true,
            link: '/sdk/api/storage',
            items: [
              {
                text: '.cookie',
                link: '/sdk/api/storage/cookie',
              },
              {
                text: '.idb',
                link: '/sdk/api/storage/idb',
              },
              {
                text: '.localStorage',
                link: '/sdk/api/storage/localstorage',
              },
              {
                text: '.memory',
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
            text: 'Actions',
            collapsed: true,
            items: [
              {
                text: 'connect',
                link: '/sdk/wagmi/connect',
              },
              {
                text: 'createAccount',
                link: '/sdk/wagmi/createAccount',
              },
              {
                text: 'disconnect',
                link: '/sdk/wagmi/disconnect',
              },
              {
                text: 'grantPermissions',
                link: '/sdk/wagmi/grantPermissions',
              },
              {
                text: 'permissions',
                link: '/sdk/wagmi/permissions',
              },
              {
                text: 'revokePermissions',
                link: '/sdk/wagmi/revokePermissions',
              },
              {
                text: 'upgradeAccount',
                link: '/sdk/wagmi/upgradeAccount',
              },
            ],
          },
          {
            text: 'Hooks',
            collapsed: true,
            items: [
              {
                text: 'useConnect',
                link: '/sdk/wagmi/useConnect',
              },
              {
                text: 'useCreateAccount',
                link: '/sdk/wagmi/useCreateAccount',
              },
              {
                text: 'useDisconnect',
                link: '/sdk/wagmi/useDisconnect',
              },
              {
                text: 'useGrantPermissions',
                link: '/sdk/wagmi/useGrantPermissions',
              },
              {
                text: 'usePermissions',
                link: '/sdk/wagmi/usePermissions',
              },
              {
                text: 'useRevokePermissions',
                link: '/sdk/wagmi/useRevokePermissions',
              },
              {
                text: 'useUpgradeAccount',
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
        text: 'Overview',
        link: '/relay',
      },
      {
        text: 'RPC Reference',
        items: [
          {
            text: 'wallet_createAccount',
            link: '/relay/rpc/wallet_createAccount',
          },
          {
            text: 'wallet_getKeys',
            link: '/relay/rpc/wallet_getKeys',
          },
          {
            text: 'wallet_prepareCalls',
            link: '/relay/rpc/wallet_prepareCalls',
          },
          {
            text: 'wallet_prepareUpgradeAccount',
            link: '/relay/rpc/wallet_prepareUpgradeAccount',
          },
          {
            text: 'wallet_sendPreparedCalls',
            link: '/relay/rpc/wallet_sendPreparedCalls',
          },
          {
            text: 'wallet_upgradeAccount',
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
      link: '/relay',
    },
    {
      text: 'Contracts',
      link: '/contracts',
    },
  ],
})
