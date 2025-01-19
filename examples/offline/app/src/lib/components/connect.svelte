<script lang="ts">
import { porto, wagmiConfig } from '$/lib/config.ts'
import { createQuery } from '@tanstack/svelte-query'
import {
  type GetAccountReturnType,
  disconnect,
  getAccount,
  getConnectors,
} from '@wagmi/core'

const account = createQuery<GetAccountReturnType>({
  queryKey: ['account'],
  queryFn: () => getAccount(wagmiConfig),
})
let connected = $derived($account?.data?.isConnected)

async function connectWallet() {
  if (connected) await disconnect(wagmiConfig)
  else {
    const connectors = getConnectors(wagmiConfig)
    const connectResult = await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: { createAccount: true },
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
