<script lang="ts">
  import '$/app.css'
  import '$lib/override.ts'
  import {
    QueryCache,
    QueryClient,
    MutationCache,
    QueryClientProvider,
  } from '@tanstack/svelte-query'
  import { onMount } from 'svelte'
  import { watchAccount } from '@wagmi/core'
  import { browser } from '$app/environment'
  import { wagmiConfig } from '$/lib/config.ts'
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
  import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client'
  import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnReconnect: () => !queryClient.isMutating(),
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (import.meta.env.MODE !== 'development') return
        if (query.state.data !== undefined) {
          console.info('Tanstack Query Error: ', error)
        }
      },
    }),
    mutationCache: new MutationCache({
      // @ts-ignore
      onSettled: () => {
        if (queryClient.isMutating() === 1) {
          queryClient.invalidateQueries()
        }
      },
    }),
  })

  const localStoragePersister = createSyncStoragePersister({
    key: 'SVELTE_QUERY',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined, // Use local storage if in browser
  })

  let { children } = $props()

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

<h1 class="mb-4">Porto Offline Delegation Demo</h1>

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: localStoragePersister }}
>
  <main>
    {@render children()}
  </main>
  <SvelteQueryDevtools
    position="bottom"
    client={queryClient}
    initialIsOpen={false}
    buttonPosition="bottom-right"
  />
</PersistQueryClientProvider>
