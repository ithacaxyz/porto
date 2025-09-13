import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import NodePath from 'node:path'
import Process from 'node:process'
import Mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vocs'

import { Plugins } from '../~internal/vite/index'

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
        items: [
          {
            link: '/contracts/interop',
            text: 'Overview',
          },
          {
            link: '/contracts/interop/escrow',
            text: 'Escrow',
          },
          {
            link: '/contracts/interop/settlement',
            text: 'Settlement',
          },
        ],
        text: 'Interop',
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
        link: '/contracts/security-and-bug-bounty',
        text: 'Security & Bug Bounty',
      },
    ],
    '/relay': [
      {
        link: '/relay',
        text: 'Overview',
      },
      {
        link: 'https://github.com/ithacaxyz/relay',
        text: 'GitHub',
      },
      {
        items: [
          {
            link: '/relay/wallet_getCapabilities',
            text: 'wallet_getCapabilities',
          },
          {
            link: '/relay/wallet_getKeys',
            text: 'wallet_getKeys',
          },
          {
            link: '/relay/wallet_getAssets',
            text: 'wallet_getAssets',
          },
          {
            link: '/relay/wallet_prepareCalls',
            text: 'wallet_prepareCalls',
          },
          {
            link: '/relay/wallet_sendPreparedCalls',
            text: 'wallet_sendPreparedCalls',
          },
          {
            link: '/relay/wallet_prepareUpgradeAccount',
            text: 'wallet_prepareUpgradeAccount',
          },
          {
            link: '/relay/wallet_upgradeAccount',
            text: 'wallet_upgradeAccount',
          },
          {
            link: '/relay/wallet_getCallsStatus',
            text: 'wallet_getCallsStatus',
          },
          {
            link: '/relay/health',
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
        link: '/sdk/production',
        text: 'Deploying to Production',
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
            link: '/sdk/guides/authentication',
            text: 'Authentication (SIWE)',
          },
          {
            link: '/sdk/guides/sponsoring',
            text: 'Fee Sponsoring',
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
            link: '/sdk/guides/theming',
            text: 'Theming',
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
            collapsed: false,
            items: [
              {
                link: '/sdk/api/route/merchant',
                text: 'Route.merchant',
              },
              {
                disabled: true,
                link: '/sdk/api/route/auth',
                text: 'Route.auth 🚧',
              },
              {
                disabled: true,
                link: '/sdk/api/route/selfRelay',
                text: 'Route.selfRelay 🚧',
              },
            ],
            link: '/sdk/api/router',
            text: 'Router',
          },
          {
            link: '/sdk/api/theme',
            text: 'Theme',
          },
          {
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
                link: '/sdk/wagmi/getAssets',
                text: 'getAssets',
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
                link: '/sdk/wagmi/useAssets',
                text: 'useAssets',
              },
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
          {
            collapsed: true,
            items: [
              {
                link: '/sdk/viem/WalletActions',
                text: 'Overview',
              },
              {
                link: '/sdk/viem/WalletActions/connect',
                text: 'connect',
              },
              {
                link: '/sdk/viem/WalletActions/disconnect',
                text: 'disconnect',
              },
              {
                link: '/sdk/viem/WalletActions/getAssets',
                text: 'getAssets',
              },
              {
                link: '/sdk/viem/WalletActions/grantPermissions',
                text: 'grantPermissions',
              },
              {
                link: '/sdk/viem/WalletActions/getPermissions',
                text: 'getPermissions',
              },
              {
                link: '/sdk/viem/WalletActions/revokePermissions',
                text: 'revokePermissions',
              },
              {
                link: '/sdk/viem/WalletActions/upgradeAccount',
                text: 'upgradeAccount',
              },
            ],
            text: 'WalletActions',
          },
          {
            items: [
              {
                collapsed: true,
                items: [
                  {
                    link: '/sdk/viem/Account',
                    text: 'Overview',
                  },
                  {
                    link: '/sdk/viem/Account/from',
                    text: 'from',
                  },
                  {
                    link: '/sdk/viem/Account/fromPrivateKey',
                    text: 'fromPrivateKey',
                  },
                  {
                    link: '/sdk/viem/Account/getKey',
                    text: 'getKey',
                  },
                  {
                    link: '/sdk/viem/Account/sign',
                    text: 'sign',
                  },
                ],
                text: 'Account',
              },
              {
                collapsed: true,
                items: [
                  {
                    link: '/sdk/viem/Key',
                    text: 'Overview',
                  },
                  {
                    link: '/sdk/viem/Key/createP256',
                    text: 'createP256',
                  },
                  {
                    link: '/sdk/viem/Key/createSecp256k1',
                    text: 'createSecp256k1',
                  },
                  {
                    link: '/sdk/viem/Key/createWebAuthnP256',
                    text: 'createWebAuthnP256',
                  },
                  {
                    link: '/sdk/viem/Key/createWebCryptoP256',
                    text: 'createWebCryptoP256',
                  },
                  {
                    link: '/sdk/viem/Key/fromP256',
                    text: 'fromP256',
                  },
                  {
                    link: '/sdk/viem/Key/fromSecp256k1',
                    text: 'fromSecp256k1',
                  },
                  {
                    link: '/sdk/viem/Key/fromWebAuthnP256',
                    text: 'fromWebAuthnP256',
                  },
                  {
                    link: '/sdk/viem/Key/fromWebCryptoP256',
                    text: 'fromWebCryptoP256',
                  },
                  {
                    link: '/sdk/viem/Key/sign',
                    text: 'sign',
                  },
                ],
                text: 'Key',
              },
              {
                collapsed: true,
                items: [
                  {
                    link: '/sdk/viem/RelayActions',
                    text: 'Overview',
                  },
                  {
                    link: '/sdk/viem/RelayActions/createAccount',
                    text: 'createAccount',
                  },
                  {
                    link: '/sdk/viem/RelayActions/getAssets',
                    text: 'getAssets',
                  },
                  {
                    link: '/sdk/viem/RelayActions/getCallsStatus',
                    text: 'getCallsStatus',
                  },
                  {
                    link: '/sdk/viem/RelayActions/getCapabilities',
                    text: 'getCapabilities',
                  },
                  {
                    link: '/sdk/viem/RelayActions/getKeys',
                    text: 'getKeys',
                  },
                  {
                    link: '/sdk/viem/RelayActions/health',
                    text: 'health',
                  },
                  {
                    link: '/sdk/viem/RelayActions/prepareCalls',
                    text: 'prepareCalls',
                  },
                  {
                    link: '/sdk/viem/RelayActions/prepareUpgradeAccount',
                    text: 'prepareUpgradeAccount',
                  },
                  {
                    link: '/sdk/viem/RelayActions/sendCalls',
                    text: 'sendCalls',
                  },
                  {
                    link: '/sdk/viem/RelayActions/sendPreparedCalls',
                    text: 'sendPreparedCalls',
                  },
                  {
                    link: '/sdk/viem/RelayActions/upgradeAccount',
                    text: 'upgradeAccount',
                  },
                ],
                text: 'RelayActions',
              },
            ],
            text: 'Relay',
          },
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
            link: '/sdk/rpc/wallet_getAssets',
            text: 'wallet_getAssets',
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
            link: '/sdk/rpc/wallet_prepareUpgradeAccount',
            text: 'wallet_prepareUpgradeAccount',
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
          {
            link: '/sdk/rpc/wallet_upgradeAccount',
            text: 'wallet_upgradeAccount',
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
      link: '/relay',
      text: 'Relay',
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
        hosts: ['localhost', 'stg.localhost', 'anvil.localhost'],
      }),
      Plugins.Icons(),
    ],
    server: {
      proxy: {},
    },
  },
})
