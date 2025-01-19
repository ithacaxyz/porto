<script lang="ts">
import Connect from '$/lib/components/connect.svelte'
import { porto, wagmiConfig } from '$/lib/config.ts'
import { ExperimentERC20 } from '$/lib/contracts'
import { browser } from '$app/environment'
import { PUBLIC_SERVER_URL } from '$env/static/public'
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/svelte-query'
import {
  type GetAccountReturnType,
  connect,
  disconnect,
  getAccount,
  getConnectors,
} from '@wagmi/core/actions'
import { Address, Json, PublicKey } from 'ox'
import { Porto } from 'porto'

interface Keys {
  expiry: number
  publicKey: PublicKey.PublicKey
  callScopes: Array<{ signature: string; to: Address.Address }>
}

const callScopes = [
  {
    signature: 'mint(address,uint256)',
    to: ExperimentERC20.address,
  },
] as const

const queryClient = useQueryClient()

let accountQuery = createQuery<GetAccountReturnType>({
  queryKey: ['account'],
  queryFn: () => getAccount(wagmiConfig),
})
let address = $derived($accountQuery.data?.address)
let keysQuery = createQuery<Array<Keys>>({
  enabled: false,
  queryKey: ['keys'],
  queryFn: () => queryClient.getQueryData<Array<Keys>>(['keys']) ?? [],
})

async function keysRequest() {
  if (!address) return
  const response = await fetch(`${PUBLIC_SERVER_URL}/v1/keys`, {
    method: 'POST',
    body: JSON.stringify({ address }),
  })
  return Json.parse(await response.text())
}

const keysRequestMutation = createMutation({
  mutationKey: ['keys'],
  mutationFn: keysRequest,
  onMutate: (variables) => {
    console.info('onMutate', variables)
    // queryClient.cancelQueries({ queryKey: ['keys'] })
  },
  onSuccess: (result, variables, context) => {
    console.info('onSuccess', result, variables, context)
    queryClient.setQueryData<Array<Keys>>(['keys'], (oldResult) =>
      oldResult ? [...oldResult, result] : [result],
    )
  },
  onSettled(data, error, variables, context) {
    console.info('onSettled', data, error, variables, context)
    queryClient.refetchQueries({ queryKey: ['keys'] })
  },
})
</script>

<section class="my-4 gap-y-3 flex flex-col justify-start size-full">
  <p>{$accountQuery.data?.address}</p>

  <Connect />

  <div class="size-full">
    <button
      type="button"
      onclick={async event => {
        const keys = $keysRequestMutation.mutate()
        console.info(keys)
        queryClient.setQueryData(['keys'], keys)
      }}
    >
      Request keys
    </button>
    <pre>{JSON.stringify($keysQuery.data, undefined, 2)}</pre>
  </div>

  <div>
    <button
      type="button"
      onclick={async event => {
        const keys = $keysQuery.data?.at(0)
        console.info(keys)
        if (!keys) return

        const authorizeKeys = await porto.provider.request({
          method: 'experimental_authorizeKey',
          params: [
            {
              address,
              key: {
                callScopes: [...callScopes],
              },
            },
          ],
        })
        console.info(authorizeKeys)
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
