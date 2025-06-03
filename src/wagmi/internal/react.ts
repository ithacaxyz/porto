'use client'

import {
  skipToken,
  type UseMutationResult,
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

import * as Typebox from '../../core/internal/typebox/typebox.js'
import * as RpcSchema from '../../core/RpcSchema.js'
import {
  connect,
  createAccount,
  disconnect,
  getAdmins,
  getPermissions,
  grantAdmin,
  grantPermissions,
  revokeAdmin,
  revokePermissions,
  upgradeAccount,
} from './core.js'
import { getAdminsQueryKey, getPermissionsQueryKey } from './query.js'
import type { ConfigParameter } from './types.js'

export function useAdmins<
  config extends Config = ResolvedRegister['config'],
  selectData = getAdmins.ReturnType,
>(
  parameters: useAdmins.Parameters<config, selectData> = {},
): useAdmins.ReturnType<selectData> {
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
      getAdminsQueryKey({
        address,
        chainId: parameters.chainId ?? chainId,
        connector: activeConnector,
      }),
    [address, chainId, parameters.chainId, activeConnector],
  )

  const provider = useRef<EIP1193Provider | undefined>(undefined)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    if (!activeConnector) return
    ;(async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'adminsChanged') return
        queryClient.setQueryData(queryKey, (data: any) => ({
          ...data,
          keys: Typebox.Decode(
            RpcSchema.wallet_getAdmins.Response.properties.keys,
            event.data,
          ),
        }))
      })
    })()
  }, [address, activeConnector, queryClient])

  return useQuery({
    ...(query as any),
    enabled,
    gcTime: 0,
    queryFn: activeConnector
      ? async (context) => {
          const { connectorUid: _, ...options } = (
            context.queryKey as typeof queryKey
          )[1]
          provider.current ??=
            (await activeConnector.getProvider()) as EIP1193Provider
          return await getAdmins(config, {
            ...options,
            connector: activeConnector,
          })
        }
      : skipToken,
    queryKey,
    staleTime: Number.POSITIVE_INFINITY,
  }) as never
}

export declare namespace useAdmins {
  type Parameters<
    config extends Config = Config,
    selectData = getAdmins.ReturnType,
  > = getAdmins.Parameters<config> &
    ConfigParameter<config> & {
      query?:
        | Omit<
            UseQueryParameters<
              getAdmins.ReturnType,
              getAdmins.ErrorType,
              selectData,
              getAdminsQueryKey.Value<config>
            >,
            'gcTime' | 'staleTime'
          >
        | undefined
    }

  type ReturnType<selectData = getAdmins.ReturnType> = UseQueryReturnType<
    selectData,
    getAdmins.ErrorType
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

/** @deprecated use `useConnect` instead */
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

export function useGrantAdmin<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useGrantAdmin.Parameters<config, context> = {},
): useGrantAdmin.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return grantAdmin(config, variables)
    },
    mutationKey: ['grantAdmin'],
  })
}

export declare namespace useGrantAdmin {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          grantAdmin.ReturnType,
          grantAdmin.ErrorType,
          grantAdmin.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    grantAdmin.ReturnType,
    grantAdmin.ErrorType,
    grantAdmin.Parameters<config>,
    context
  >
}

export function useGrantPermissions<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useGrantPermissions.Parameters<config, context> = {},
): useGrantPermissions.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return grantPermissions(config, variables)
    },
    mutationKey: ['grantPermissions'],
  })
}

export declare namespace useGrantPermissions {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          grantPermissions.ReturnType,
          grantPermissions.ErrorType,
          grantPermissions.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    grantPermissions.ReturnType,
    grantPermissions.ErrorType,
    grantPermissions.Parameters<config>,
    context
  >
}

export function usePermissions<
  config extends Config = ResolvedRegister['config'],
  selectData = getPermissions.ReturnType,
>(
  parameters: usePermissions.Parameters<config, selectData> = {},
): usePermissions.ReturnType<selectData> {
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
      getPermissionsQueryKey({
        address,
        chainId: parameters.chainId ?? chainId,
        connector: activeConnector,
      }),
    [address, chainId, parameters.chainId, activeConnector],
  )

  const provider = useRef<EIP1193Provider | undefined>(undefined)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    if (!activeConnector) return
    ;(async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'permissionsChanged') return
        queryClient.setQueryData(
          queryKey,
          Typebox.Decode(RpcSchema.wallet_getPermissions.Response, event.data),
        )
      })
    })()
  }, [address, activeConnector, queryClient])

  return useQuery({
    ...(query as any),
    enabled,
    gcTime: 0,
    queryFn: activeConnector
      ? async (context) => {
          const { connectorUid: _, ...options } = (
            context.queryKey as typeof queryKey
          )[1]
          provider.current ??=
            (await activeConnector.getProvider()) as EIP1193Provider
          return await getPermissions(config, {
            ...options,
            connector: activeConnector,
          })
        }
      : skipToken,
    queryKey,
    staleTime: Number.POSITIVE_INFINITY,
  }) as never
}

export declare namespace usePermissions {
  type Parameters<
    config extends Config = Config,
    selectData = getPermissions.ReturnType,
  > = getPermissions.Parameters<config> &
    ConfigParameter<config> & {
      query?:
        | Omit<
            UseQueryParameters<
              getPermissions.ReturnType,
              getPermissions.ErrorType,
              selectData,
              getPermissionsQueryKey.Value<config>
            >,
            'gcTime' | 'staleTime'
          >
        | undefined
    }

  type ReturnType<selectData = getPermissions.ReturnType> = UseQueryReturnType<
    selectData,
    getPermissions.ErrorType
  >
}

export function useRevokeAdmin<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useRevokeAdmin.Parameters<config, context> = {},
): useRevokeAdmin.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return revokeAdmin(config, variables)
    },
    mutationKey: ['revokeAdmin'],
  })
}

export declare namespace useRevokeAdmin {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          undefined,
          revokeAdmin.ErrorType,
          revokeAdmin.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    undefined,
    revokeAdmin.ErrorType,
    revokeAdmin.Parameters<config>,
    context
  >
}

export function useRevokePermissions<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useRevokePermissions.Parameters<config, context> = {},
): useRevokePermissions.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return revokePermissions(config, variables)
    },
    mutationKey: ['revokePermissions'],
  })
}

export declare namespace useRevokePermissions {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          undefined,
          revokePermissions.ErrorType,
          revokePermissions.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    undefined,
    revokePermissions.ErrorType,
    revokePermissions.Parameters<config>,
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
