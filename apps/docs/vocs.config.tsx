import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import NodePath from 'node:path'
import Process from 'node:process'
import Icons from 'unplugin-icons/vite'
import Mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vocs'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  Process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// don't index porto.sh except in production
if (
  Process.env.NODE_ENV === 'production' &&
  Process.env.VITE_VERCEL_ENV === 'production'
) {
  NodeFS.writeFileSync(
    NodePath.join(Process.cwd(), 'public', 'robots.txt'),
    ['User-agent: *', 'Allow: /'].join('\n'),
  )
}

export default defineConfig({
  description:
    'Sign in with superpowers. Buy, swap, subscribe, and much more. No passwords or extensions required.',
  head() {
    return (
      <>
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=1"
          name="viewport"
        />
        <meta content="https://porto.sh/og-image.png" property="og:image" />
        <meta content="image/png" property="og:image:type" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        <meta content={commitSha} name="x-app-version" />
        <meta
          content={
            process.env.VITE_VERCEL_ENV !== 'production'
              ? 'noindex, nofollow'
              : 'index, follow'
          }
          name="robots"
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
      {
        items: [
          {
            link: '/contracts/account',
            text: 'Account',
          },
          {
            link: '/contracts/orchestrator',
            text: 'Orchestrator',
          },
          {
            link: '/contracts/simulator',
            text: 'Simulator',
          },
        ],
        text: 'Contracts',
      },
      {
        link: '/contracts/address-book',
        text: 'Address Book',
      },
      {
        link: '/contracts/benchmarks',
        text: 'Benchmarks',
      },
      {
        link: '/contracts/security',
        text: 'Security',
      },
      {
        link: '/contracts/bug-bounty',
        text: 'Bug Bounty',
      },
    ],
    '/rpc-server': [
      {
        link: '/rpc-server',
        text: 'Overview',
      },
      {
        link: 'https://github.com/ithacaxyz/rpc-server-issues',
        text: 'GitHub',
      },
      {
        items: [
          {
            link: '/rpc-server/wallet_getCapabilities',
            text: 'wallet_getCapabilities',
          },
          {
            link: '/rpc-server/wallet_getAccounts',
            text: 'wallet_getAccounts',
          },
          {
            link: '/rpc-server/wallet_getKeys',
            text: 'wallet_getKeys',
          },
          {
            link: '/rpc-server/wallet_prepareCalls',
            text: 'wallet_prepareCalls',
          },
          {
            link: '/rpc-server/wallet_sendPreparedCalls',
            text: 'wallet_sendPreparedCalls',
          },
          {
            link: '/rpc-server/wallet_prepareUpgradeAccount',
            text: 'wallet_prepareUpgradeAccount',
          },
          {
            link: '/rpc-server/wallet_upgradeAccount',
            text: 'wallet_upgradeAccount',
          },
          {
            link: '/rpc-server/wallet_getCallsStatus',
            text: 'wallet_getCallsStatus',
          },
          {
            link: '/rpc-server/wallet_verifySignature',
            text: 'wallet_verifySignature',
          },
          {
            link: '/rpc-server/health',
            text: 'health',
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
        link: 'https://github.com/ithacaxyz/porto',
        text: 'GitHub',
      },
      {
        link: 'https://deepwiki.com/ithacaxyz/porto',
        text: 'DeepWiki',
      },
      {
        link: '/sdk/faq',
        text: 'FAQ',
      },
      {
        items: [
          {
            link: '/sdk/guides/discover-accounts',
            text: 'Onboard & Discover Accounts',
          },
          {
            link: '/sdk/guides/payments',
            text: 'Payments',
          },
          {
            link: '/sdk/guides/permissions',
            text: 'Permissions',
          },
          {
            link: '/sdk/guides/subscriptions',
            text: 'Subscriptions',
          },
          {
            disabled: true,
            link: '/sdk/guides/authentication',
            text: 'Authentication (SIWE) 🚧',
          },
          {
            disabled: true,
            link: '/sdk/guides/sponsoring',
            text: 'Fee Sponsoring 🚧',
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
            link: '/sdk/api/chains',
            text: 'Chains',
          },
          {
            link: '/sdk/api/dialog',
            text: 'Dialog',
          },
          {
            link: '/sdk/api/mode',
            text: 'Mode',
          },
          {
            collapsed: true,
            link: '/sdk/api/storage',
            text: 'Storage',
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
            link: '/sdk/wagmi/connector',
            text: 'Connector',
          },
          {
            collapsed: true,
            items: [
              {
                link: '/sdk/wagmi/connect',
                text: 'connect',
              },
              {
                link: '/sdk/wagmi/disconnect',
                text: 'disconnect',
              },
              {
                link: '/sdk/wagmi/grantPermissions',
                text: 'grantPermissions',
              },
              {
                link: '/sdk/wagmi/getPermissions',
                text: 'getPermissions',
              },
              {
                link: '/sdk/wagmi/revokePermissions',
                text: 'revokePermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/upgradeAccount',
                text: 'upgradeAccount',
              },
            ],
            text: 'Actions',
          },
          {
            collapsed: true,
            items: [
              {
                link: '/sdk/wagmi/useGrantPermissions',
                text: 'useGrantPermissions',
              },
              {
                link: '/sdk/wagmi/usePermissions',
                text: 'usePermissions',
              },
              {
                link: '/sdk/wagmi/useRevokePermissions',
                text: 'useRevokePermissions',
              },
              {
                disabled: true,
                link: '/sdk/wagmi/useUpgradeAccount',
                text: 'useUpgradeAccount',
              },
            ],
            text: 'Hooks',
          },
        ],
        text: 'Wagmi Reference',
      },
      {
        items: [
          {
            link: '/sdk/viem',
            text: 'Overview',
          },
          // {
          //   link: '/sdk/viem/Account',
          //   text: 'Account',
          // },
          // {
          //   link: '/sdk/viem/Key',
          //   text: 'Key',
          // },
          {
            collapsed: true,
            items: [
              {
                link: '/sdk/viem/wallet-actions',
                text: 'Overview',
              },
              {
                link: '/sdk/viem/connect',
                text: 'connect',
              },
              {
                link: '/sdk/viem/disconnect',
                text: 'disconnect',
              },
              {
                link: '/sdk/viem/grantPermissions',
                text: 'grantPermissions',
              },
              {
                link: '/sdk/viem/getPermissions',
                text: 'getPermissions',
              },
              {
                link: '/sdk/viem/revokePermissions',
                text: 'revokePermissions',
              },
              // {
              //   link: '/sdk/viem/upgradeAccount',
              //   text: 'upgradeAccount',
              // },
            ],
            text: 'Wallet Actions',
          },
          // {
          //   collapsed: true,
          //   items: [
          //     {
          //       link: '/sdk/viem/execute',
          //       text: 'execute',
          //     },
          //     {
          //       link: '/sdk/viem/getEip712Domain',
          //       text: 'getEip712Domain',
          //     },
          //     {
          //       link: '/sdk/viem/keyAt',
          //       text: 'keyAt',
          //     },
          //     {
          //       link: '/sdk/viem/prepareExecute',
          //       text: 'prepareExecute',
          //     },
          //   ],
          //   text: 'Contract Actions',
          // },
          // {
          //   collapsed: true,
          //   items: [
          //     {
          //       link: '/sdk/viem/createAccount',
          //       text: 'createAccount',
          //     },
          //     {
          //       link: '/sdk/viem/getAccounts',
          //       text: 'getAccounts',
          //     },
          //     {
          //       link: '/sdk/viem/getCallsStatus',
          //       text: 'getCallsStatus',
          //     },
          //     {
          //       link: '/sdk/viem/getCapabilities',
          //       text: 'getCapabilities',
          //     },
          //     {
          //       link: '/sdk/viem/getKeys',
          //       text: 'getKeys',
          //     },
          //     {
          //       link: '/sdk/viem/health',
          //       text: 'health',
          //     },
          //     {
          //       link: '/sdk/viem/prepareCalls',
          //       text: 'prepareCalls',
          //     },
          //     {
          //       link: '/sdk/viem/prepareUpgradeAccount',
          //       text: 'prepareUpgradeAccount',
          //     },
          //     {
          //       link: '/sdk/viem/sendPreparedCalls',
          //       text: 'sendPreparedCalls',
          //     },
          //     {
          //       link: '/sdk/viem/upgradeAccount',
          //       text: 'upgradeAccount',
          //     },
          //     {
          //       link: '/sdk/viem/verifySignature',
          //       text: 'verifySignature',
          //     },
          //   ],
          //   text: 'Server Actions',
          // },
        ],
        text: 'Viem Reference',
      },
      {
        items: [
          {
            link: '/sdk/rpc',
            text: 'Overview',
          },
          {
            link: '/sdk/rpc/capabilities',
            text: 'Capabilities',
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
            link: '/sdk/rpc/wallet_getPermissions',
            text: 'wallet_getPermissions',
          },
          {
            link: '/sdk/rpc/wallet_grantPermissions',
            text: 'wallet_grantPermissions',
          },
          {
            link: '/sdk/rpc/wallet_revokePermissions',
            text: 'wallet_revokePermissions',
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
      link: '/rpc-server',
      text: 'RPC Server',
    },
    {
      link: '/contracts',
      text: 'Contracts',
    },
    {
      link: '/changelog',
      text: 'Changelog',
    },
  ],
  vite: {
    plugins: [
      Mkcert({
        hosts: [
          'localhost',
          'prod.localhost',
          'stg.localhost',
          'dev.localhost',
          'anvil.localhost',
        ],
      }),
      Icons({ compiler: 'jsx', jsx: 'react' }) as never,
    ],
    server: {
      proxy: {},
    },
  },
})
