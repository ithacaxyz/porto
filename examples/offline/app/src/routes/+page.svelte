<script lang="ts">
import Connect from '$/lib/components/connect.svelte'
import { porto, wagmiConfig } from '$/lib/config.ts'
import { ExperimentERC20 } from '$/lib/contracts'
import { PUBLIC_SERVER_URL } from '$env/static/public'
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/svelte-query'
import { type GetAccountReturnType, getAccount } from '@wagmi/core/actions'
import { Json } from 'ox'
import type { Rpc } from 'ox/Authorization'
import { Key } from 'porto'
import type { Prettify } from 'viem'

type Keys = Prettify<ReturnType<typeof Key.fromWebCryptoP256>>

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
let keys = $derived($keysQuery.data)

let authorizedKeysQuery = createQuery<Array<Rpc>>({
  enabled: false,
  queryKey: ['authorizedKeys'],
  queryFn: () => queryClient.getQueryData<Array<Rpc>>(['authorizedKeys']) ?? [],
})

async function keysRequest() {
  if (!address) return
  const response = await fetch(`${PUBLIC_SERVER_URL}/keys`, {
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
    <button type="button" onclick={() => $keysRequestMutation.mutate()}> Request keys </button>
    <pre>{Json.stringify(keys, undefined, 2)}</pre>
  </div>

  <div class="size-full">
    <button
      type="button"
      onclick={async _ => {
        const keys = $keysQuery.data?.at(0)
        console.info(Json.stringify(keys, undefined, 2))
        if (!keys) return

        const authorizeKeys = await porto.provider.request({
          method: 'experimental_authorizeKey',
          params: [
            {
              address,
              key: Key.toRpc({ ...keys, role: 'admin' }) as any,
            },
          ],
        })

        queryClient.setQueryData<Array<typeof authorizeKeys>>(['authorizedKeys'], oldResult =>
          oldResult ? [...oldResult, authorizeKeys] : [authorizeKeys],
        )
      }}
    >
      Authorize key
    </button>
    <pre>{Json.stringify($authorizedKeysQuery.data, undefined, 2)}</pre>
  </div>
</section>

<style>
  :global(button) {
    cursor: pointer;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    border: 1px solid #333;
    text-align: left;
    font-size: 14px;
  }
</style>
