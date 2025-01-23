<script lang="ts">
import { porto, wagmiConfig } from '$/lib/config.ts'
import { createQuery } from '@tanstack/svelte-query'
import { type GetAccountReturnType, getAccount } from '@wagmi/core'

const account = createQuery<GetAccountReturnType>({
  queryKey: ['account'],
  queryFn: () => getAccount(wagmiConfig),
})
let connected = $derived($account?.data?.isConnected)

async function connectWallet() {
  if (connected) await porto.provider.request({ method: 'wallet_disconnect' })
  else {
    const connectResult = await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: { createAccount: true },
        },
      ],
    })
    console.info(`${connectResult.accounts.at(0)?.address} connected`)
  }
}
</script>

<button
  type="button"
  onclick={connectWallet}
  class="hover:cursor-pointer mr-auto bg-[#145AC6] text-white"
>
  {connected ? 'logout' : 'login'}
</button>
