<script lang="ts">
import '$/app.css'
import { wagmiConfig } from '$/lib/config.ts'
import { browser } from '$app/environment'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/svelte-query'
import { watchAccount } from '@wagmi/core'
import { onMount } from 'svelte'

let { children } = $props()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { enabled: browser },
  },
  queryCache: new QueryCache({
    onError: (error, query) => console.error(error, query),
  }),
})

onMount(() => {
  watchAccount(wagmiConfig, {
    onChange: (account, _) => {
      queryClient.setQueryData(['account'], account)
    },
  })
})
</script>

<svelte:head>
  <title>Proto Offline</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <main>
    {@render children()}
  </main>
</QueryClientProvider>
