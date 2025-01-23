import { Provider, type RpcRequest, RpcResponse } from 'ox'
import type { Porto } from 'porto'
import type { Schema } from 'porto/core/internal/rpcSchema.js' // TODO: Replace with proper import
import { useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'
import { messenger, porto } from './porto'

export const requestsStore = createStore(
  import.meta.env.DEV
    ? persist(getInitialState, {
        name: 'porto.requests',
        partialize(state) {
          return {
            requests: state.requests,
          }
        },
      })
    : getInitialState,
)

export declare namespace requestsStore {
  type State = {
    requests: readonly (Porto.QueuedRequest & {
      request: RpcRequest.RpcRequest<Schema>
    })[]
    reject: (request: Porto.QueuedRequest) => Promise<void>
    respond: (request: Porto.QueuedRequest) => Promise<void>
  }
}

function getInitialState(): requestsStore.State {
  return {
    requests: [],
    async reject(request) {
      messenger.send(
        'rpc-response',
        RpcResponse.from({
          id: request.request.id,
          jsonrpc: '2.0',
          error: {
            code: Provider.UserRejectedRequestError.code,
            message: 'User rejected the request.',
          },
        }),
      )
    },
    async respond(request) {
      const shared = { id: request.request.id, jsonrpc: '2.0' } as const
      try {
        const result = await porto.provider.request(request.request)
        messenger.send('rpc-response', RpcResponse.from({ ...shared, result }))
      } catch (e) {
        const error = e as RpcResponse.BaseError
        messenger.send('rpc-response', RpcResponse.from({ ...shared, error }))
        throw error
      }
    },
  }
}

export function useRequestsStore<slice = requestsStore.State>(
  selector: Parameters<typeof useStore<typeof requestsStore, slice>>[1] = (
    state,
  ) => state as slice,
) {
  return useStore(requestsStore, useShallow(selector))
}
