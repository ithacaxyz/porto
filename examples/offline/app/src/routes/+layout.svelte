<script lang="ts">
import '$/app.css'
import '$lib/override.ts'
import { wagmiConfig } from '$/lib/config.ts'
import { browser } from '$app/environment'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/svelte-query'
import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client'
import { watchAccount } from '@wagmi/core'
import { onMount } from 'svelte'

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

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: localStoragePersister }}
>
  <main class="mx-4">
    <header class="grid grid-cols-3 mt-3 w-full w-full mb-10">
      <h1 class="col-start-2 text-lg font-extrabold uppercase">Porto Offline Delegation Demo</h1>

      <img
        alt="Logo"
        src="https://github.com/ithacaxyz.png"
        class="w-min justify-self-end col-start-3 size-10 pointer-events-none"
      />
    </header>
    {@render children()}
  </main>
  <SvelteQueryDevtools
    position="bottom"
    client={queryClient}
    initialIsOpen={false}
    buttonPosition="bottom-right"
  />
</PersistQueryClientProvider>
