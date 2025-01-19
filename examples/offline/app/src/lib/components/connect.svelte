<script lang="ts">
  import { porto, wagmiConfig } from '$/lib/config.ts'
  import { createQuery, useQueryClient } from '@tanstack/svelte-query'
  import { disconnect, getAccount, getConnectors, type GetAccountReturnType } from '@wagmi/core'

  const queryClient = useQueryClient()

  const account = createQuery<GetAccountReturnType>({
    queryKey: ['account'],
    queryFn: () => getAccount(wagmiConfig),
  })
  let connected = $derived($account?.data?.isConnected)

  async function connectWallet() {
    if (connected) await disconnect(wagmiConfig)
    else {
      const connectors = getConnectors(wagmiConfig)
      const portoConnector = connectors.filter(connector => connector.id === 'xyz.ithaca.porto')
      const connectResult = await porto.provider.request({
        method: 'wallet_connect',
        params: [
          {
            capabilities: {
              createAccount: true,
            },
          },
        ],
      })
      console.info(`${connectResult.accounts.at(0)} connected`)
    }
  }
</script>

<button type="button" onclick={connectWallet} class="hover:cursor-pointer mr-auto">
  {connected ? 'disconnect' : 'connect'}
</button>
