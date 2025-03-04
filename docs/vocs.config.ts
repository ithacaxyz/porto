import { defineConfig } from 'vocs'

export default defineConfig({
  rootDir: '.',
  title: 'Porto',
  description: 'Next-gen Account for Ethereum',
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
            text: 'Applications',
            link: '/sdk/guides/connection',
          },
          {
            text: 'Authentication',
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
            text: 'Actions',
            collapsed: true,
            items: [
              {
                text: 'connect',
                link: '/sdk/api/wagmi/connect',
              },
              {
                text: 'createAccount',
                link: '/sdk/api/wagmi/createAccount',
              },
              {
                text: 'disconnect',
                link: '/sdk/api/wagmi/disconnect',
              },
              {
                text: 'grantPermissions',
                link: '/sdk/api/wagmi/grantPermissions',
              },
              {
                text: 'permissions',
                link: '/sdk/api/wagmi/permissions',
              },
              {
                text: 'revokePermissions',
                link: '/sdk/api/wagmi/revokePermissions',
              },
              {
                text: 'upgradeAccount',
                link: '/sdk/api/wagmi/upgradeAccount',
              },
            ],
          },
          {
            text: 'Hooks',
            collapsed: true,
            items: [
              {
                text: 'useConnect',
                link: '/sdk/api/wagmi/useConnect',
              },
              {
                text: 'useCreateAccount',
                link: '/sdk/api/wagmi/useCreateAccount',
              },
              {
                text: 'useDisconnect',
                link: '/sdk/api/wagmi/useDisconnect',
              },
              {
                text: 'useGrantPermissions',
                link: '/sdk/api/wagmi/useGrantPermissions',
              },
              {
                text: 'usePermissions',
                link: '/sdk/api/wagmi/usePermissions',
              },
              {
                text: 'useRevokePermissions',
                link: '/sdk/api/wagmi/useRevokePermissions',
              },
              {
                text: 'useUpgradeAccount',
                link: '/sdk/api/wagmi/useUpgradeAccount',
              },
            ],
          },
        ],
      },
      {
        text: 'RPC Reference',
        items: [
          {
            text: 'eth_accounts',
            link: '/sdk/api/eth_accounts',
          },
          {
            text: 'eth_requestAccounts',
            link: '/sdk/api/eth_requestAccounts',
          },
          {
            text: 'eth_sendTransaction',
            link: '/sdk/api/eth_sendTransaction',
          },
          {
            text: 'eth_signTypedData_V4',
            link: '/sdk/api/eth_signTypedData_V4',
          },
          {
            text: 'experimental_createAccount',
            link: '/sdk/api/experimental_createAccount',
          },
          {
            text: 'experimental_grantPermissions',
            link: '/sdk/api/experimental_grantPermissions',
          },
          {
            text: 'experimental_permissions',
            link: '/sdk/api/experimental_permissions',
          },
          {
            text: 'experimental_revokePermissions',
            link: '/sdk/api/experimental_revokePermissions',
          },
          {
            text: 'personal_sign',
            link: '/sdk/api/personal_sign',
          },
          {
            text: 'wallet_connect',
            link: '/sdk/api/wallet_connect',
          },
          {
            text: 'wallet_disconnect',
            link: '/sdk/api/wallet_disconnect',
          },
          {
            text: 'wallet_getCapabilities',
            link: '/sdk/api/wallet_getCapabilities',
          },
          {
            text: 'wallet_getCallsStatus',
            link: '/sdk/api/wallet_getCallsStatus',
          },
          {
            text: 'wallet_prepareCalls',
            link: '/sdk/api/wallet_prepareCalls',
          },
          {
            text: 'wallet_sendCalls',
            link: '/sdk/api/wallet_sendCalls',
          },
          {
            text: 'wallet_sendPreparedCalls',
            link: '/sdk/api/wallet_sendPreparedCalls',
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
            link: '/relay/api/wallet_createAccount',
          },
          {
            text: 'wallet_getKeys',
            link: '/relay/api/wallet_getKeys',
          },
          {
            text: 'wallet_prepareCalls',
            link: '/relay/api/wallet_prepareCalls',
          },
          {
            text: 'wallet_prepareUpgradeAccount',
            link: '/relay/api/wallet_prepareUpgradeAccount',
          },
          {
            text: 'wallet_sendPreparedCalls',
            link: '/relay/api/wallet_sendPreparedCalls',
          },
          {
            text: 'wallet_upgradeAccount',
            link: '/relay/api/wallet_upgradeAccount',
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
      link: 'https://github.com/ithacaxyz',
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
