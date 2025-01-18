<script lang="ts">
  import '$/app.css'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { watchAccount } from '@wagmi/core'
  import { wagmiConfig } from '$/lib/config.ts'
  import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

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
