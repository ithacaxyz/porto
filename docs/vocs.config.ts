import { defineConfig } from 'vocs'

export default defineConfig({
  rootDir: '.',
  title: 'Porto',
  description: 'Next-gen Account for Ethereum',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/',
    },
    {
      text: 'JSON-RPC Reference',
      items: [
        {
          text: 'eth_accounts',
          // link: '/json-rpc/eth_accounts',
        },
      ],
    },
    {
      text: 'API Reference',
      items: [
        {
          text: 'Porto',
          // link: '/api/porto',
          items: [
            {
              text: '.create',
              // link: '/api/porto/create',
            },
          ],
        },
      ],
    },
  ],
})
