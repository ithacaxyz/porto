<script lang="ts">
  import {
    connect,
    disconnect,
    getAccount,
    getConnectors,
    type GetAccountReturnType,
  } from '@wagmi/core/actions'
  import { Porto } from 'porto'
  import type { Address } from 'viem'
  import { Actions } from 'porto/wagmi'
  import { wagmiConfig, porto } from '$/lib/config.ts'
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'

  const queryClient = useQueryClient()

  const account = createQuery<GetAccountReturnType>({
    queryKey: ['account'],
    queryFn: () => getAccount(wagmiConfig),
  })
  let address = $derived($account?.data?.address)

  async function keysRequest() {
    if (!address) return
    const response = await fetch('http://localhost:6900/keys', {
      method: 'POST',
      body: JSON.stringify({ address }),
    })
    return response.json()
  }

  const keysRequestMutation = createMutation({
    mutationFn: keysRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] })
    },
  })

  async function connectWallet() {
    if ($account?.data?.isConnected) {
      const d = await disconnect(wagmiConfig)
    } else {
      const [connector, ...connectors] = getConnectors(wagmiConfig)
      const portoConnectResult = await Actions.connect(
        {
          connectors: [connector],
        },
        {
          connector,
        },
      )
      await connect(wagmiConfig, { connector, chainId: 911_867 })
    }
  }
</script>

<h1 class="mb-4">Porto Offline Delegation Demo</h1>

<button type="button" onclick={connectWallet} class="hover:cursor-pointer">
  {$account?.data?.isConnected ? 'disconnect' : 'connect'}
</button>

<section class="my-4">
  <div>
    <button type="button" onclick={async event => $keysRequestMutation.mutate()}>
      Request keys
    </button>
    <pre>{$keysRequestMutation.data}</pre>
  </div>
  <div></div>

  <div>
    <button
      type="button"
      onclick={async event => {
        console.info(
          porto._internal.config.implementation.actions.signPersonalMessage({
            config: porto._internal.config,
            account: account,
            clients: porto._internal.state.clients,
            data: address,
            request: porto._internal.state.request,
          }),
        )
        const _porto = Porto.create()
        _porto.provider.request({
          method: 'personal_sign',
          params: [address, address],
        })
      }}
    >
      Authorize key
    </button>
  </div>
</section>

<style>
  :global(button) {
    cursor: pointer;
  }
</style>
