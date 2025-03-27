import { Chains, Implementation, Storage } from 'porto'
import { Porto } from 'porto/remote'
import { http } from 'viem'

const searchParams = new URLSearchParams(window.location.search)
const relay = searchParams.get('relay') !== null

export const porto = Porto.create({
  implementation: relay ? Implementation.relay() : Implementation.local(),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
  transports: relay
    ? {
        [Chains.odysseyTestnet.id]: {
          default: http(),
          relay: http('https://relay-staging.ithaca.xyz'),
        },
      }
    : undefined,
})
