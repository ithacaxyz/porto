'use client'

import {
  type UseMutationResult,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import type { EIP1193Provider } from 'viem'
import {
  type Config,
  type ResolvedRegister,
  useAccount,
  useChainId,
  useConfig,
} from 'wagmi'
import type {
  UseMutationParameters,
  UseQueryParameters,
  UseQueryReturnType,
} from 'wagmi/query'

import {
  authorizeKey,
  connect,
  createAccount,
  disconnect,
  keys,
  revokeKey,
  upgradeAccount,
} from './core.js'
import { keysQueryKey } from './query.js'
import type { ConfigParameter } from './types.js'

export function useAuthorizeKey<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useAuthorizeKey.Parameters<config, context> = {},
): useAuthorizeKey.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return authorizeKey(config, variables)
    },
    mutationKey: ['authorizeKey'],
  })
}

export declare namespace useAuthorizeKey {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          authorizeKey.ReturnType,
          authorizeKey.ErrorType,
          authorizeKey.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    authorizeKey.ReturnType,
    authorizeKey.ErrorType,
    authorizeKey.Parameters<config>,
    context
  >
}

export function useConnect<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useConnect.Parameters<config, context> = {},
): useConnect.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return connect(config as Config, variables)
    },
    mutationKey: ['connect'],
  })
}

export declare namespace useConnect {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          connect.ReturnType,
          connect.ErrorType,
          connect.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    connect.ReturnType,
    connect.ErrorType,
    connect.Parameters<config>,
    context
  >
}

export function useCreateAccount<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useCreateAccount.Parameters<config, context> = {},
): useCreateAccount.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return createAccount(config as Config, variables)
    },
    mutationKey: ['createAccount'],
  })
}

export declare namespace useCreateAccount {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          createAccount.ReturnType,
          createAccount.ErrorType,
          createAccount.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    createAccount.ReturnType,
    createAccount.ErrorType,
    createAccount.Parameters<config>,
    context
  >
}

export function useDisconnect<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useDisconnect.Parameters<context> = {},
): useDisconnect.ReturnType<context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      await disconnect(config, variables)
    },
    mutationKey: ['disconnect'],
  })
}

export declare namespace useDisconnect {
  type Parameters<context = unknown> = ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          disconnect.ReturnType,
          disconnect.ErrorType,
          disconnect.Parameters,
          context
        >
      | undefined
  }

  type ReturnType<context = unknown> = UseMutationResult<
    disconnect.ReturnType,
    disconnect.ErrorType,
    disconnect.Parameters,
    context
  >
}

export function useKeys<
  config extends Config = ResolvedRegister['config'],
  selectData = keys.ReturnType,
>(
  parameters: useKeys.Parameters<config, selectData> = {},
): useKeys.ReturnType<selectData> {
  const { query = {}, ...rest } = parameters

  const config = useConfig(rest)
  const queryClient = useQueryClient()
  const chainId = useChainId({ config })
  const { address, connector, status } = useAccount()
  const activeConnector = parameters.connector ?? connector

  const enabled = Boolean(
    (status === 'connected' ||
      (status === 'reconnecting' && activeConnector?.getProvider)) &&
      (query.enabled ?? true),
  )
  const queryKey = useMemo(
    () =>
      keysQueryKey({
        address,
        chainId: parameters.chainId ?? chainId,
        connector: activeConnector,
      }),
    [address, chainId, parameters.chainId, activeConnector],
  )

  const provider = useRef<EIP1193Provider>()
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    if (!activeConnector) return
    ;(async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'keysChanged') return
        queryClient.setQueryData(queryKey, event.data)
      })
    })()
  }, [address, activeConnector, queryClient])

  return useQuery({
    ...(query as any),
    enabled,
    gcTime: 0,
    queryKey,
    queryFn: activeConnector
      ? async (context) => {
          const { connectorUid: _, ...options } = (
            context.queryKey as typeof queryKey
          )[1]
          provider.current ??=
            (await activeConnector.getProvider()) as EIP1193Provider
          return await keys(config, {
            ...options,
            connector: activeConnector,
          })
        }
      : skipToken,
    staleTime: Number.POSITIVE_INFINITY,
  }) as never
}

export declare namespace useKeys {
  type Parameters<
    config extends Config = Config,
    selectData = keys.ReturnType,
  > = keys.Parameters<config> &
    ConfigParameter<config> & {
      query?:
        | Omit<
            UseQueryParameters<
              keys.ReturnType,
              keys.ErrorType,
              selectData,
              keysQueryKey.Value<config>
            >,
            'gcTime' | 'staleTime'
          >
        | undefined
    }

  type ReturnType<selectData = keys.ReturnType> = UseQueryReturnType<
    selectData,
    keys.ErrorType
  >
}

export function useRevokeKey<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useRevokeKey.Parameters<config, context> = {},
): useRevokeKey.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return revokeKey(config, variables)
    },
    mutationKey: ['revokeKey'],
  })
}

export declare namespace useRevokeKey {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          undefined,
          revokeKey.ErrorType,
          revokeKey.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    undefined,
    revokeKey.ErrorType,
    revokeKey.Parameters<config>,
    context
  >
}

export function useUpgradeAccount<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useUpgradeAccount.Parameters<config, context> = {},
): useUpgradeAccount.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return upgradeAccount(config as Config, variables)
    },
    mutationKey: ['upgradeAccount'],
  })
}

export declare namespace useUpgradeAccount {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          upgradeAccount.ReturnType,
          upgradeAccount.ErrorType,
          upgradeAccount.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    upgradeAccount.ReturnType,
    upgradeAccount.ErrorType,
    upgradeAccount.Parameters<config>,
    context
  >
}
