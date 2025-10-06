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

import {
  addFunds,
  connect,
  disconnect,
  getAdmins,
  getAssets,
  getPermissions,
  grantAdmin,
  grantPermissions,
  revokeAdmin,
  revokePermissions,
  upgradeAccount,
  verifyEmail,
} from './core.js'
import {
  getAdminsQueryKey,
  getAssetsQueryKey,
  getPermissionsQueryKey,
} from './query.js'
import type { ConfigParameter } from './types.js'

export function useAddFunds<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useAddFunds.Parameters<config, context> = {},
): useAddFunds.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return addFunds(config, variables)
    },
    mutationKey: ['addFunds'],
  })
}

export declare namespace useAddFunds {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> &
    addFunds.Parameters<config> &
    ConfigParameter<config> & {
      mutation?:
        | UseMutationParameters<
            addFunds.ReturnType,
            addFunds.ErrorType,
            addFunds.Parameters<config>,
            context
          >
        | undefined
    }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    addFunds.ReturnType,
    addFunds.ErrorType,
    addFunds.Parameters<config>,
    context
  >
}

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
    void (async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'adminsChanged') return
        queryClient.invalidateQueries({ queryKey })
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

export function useAssets<
  config extends Config = ResolvedRegister['config'],
  selectData = getAssets.ReturnType,
>(
  parameters: useAssets.Parameters<config, selectData> = {},
): useAssets.ReturnType<selectData> {
  const {
    assetFilter,
    assetTypeFilter,
    chainFilter,
    query = {},
    ...rest
  } = parameters

  const config = useConfig(rest)
  const queryClient = useQueryClient()
  const { address, connector, status } = useAccount()

  const account = parameters.account ?? address
  const activeConnector = parameters.connector ?? connector

  const enabled = Boolean(
    account &&
      (status === 'connected' ||
        (status === 'reconnecting' && activeConnector?.getProvider)) &&
      (query.enabled ?? true),
  )

  const queryKey = useMemo(
    () =>
      getAssetsQueryKey({
        account,
        assetFilter,
        assetTypeFilter,
        chainFilter,
        connector: activeConnector,
      }),
    [account, activeConnector, assetFilter, assetTypeFilter, chainFilter],
  )

  const provider = useRef<EIP1193Provider | undefined>(undefined)
  // biome-ignore lint/correctness/useExhaustiveDependencies: `queryKey` not required
  useEffect(() => {
    if (!activeConnector) return
    void (async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'assetsChanged') return
        queryClient.invalidateQueries({ queryKey })
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
          return await getAssets(config, {
            ...options,
            connector: activeConnector,
          })
        }
      : skipToken,
    queryKey,
    staleTime: Number.POSITIVE_INFINITY,
  }) as never
}

export declare namespace useAssets {
  type Parameters<
    config extends Config = Config,
    selectData = getAssets.ReturnType,
  > = getAssets.Parameters &
    ConfigParameter<config> & {
      query?:
        | Omit<
            UseQueryParameters<
              getAssets.ReturnType,
              getAssets.ErrorType,
              selectData,
              getAssetsQueryKey.Value<config>
            >,
            'gcTime' | 'staleTime'
          >
        | undefined
    }

  type ReturnType<selectData = getAssets.ReturnType> = UseQueryReturnType<
    selectData,
    getAssets.ErrorType
  >
}

export function useConnect<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useConnect.Parameters<config, context> = {},
): useConnect.ReturnType<context> {
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
          connect.Parameters,
          context
        >
      | undefined
  }

  type ReturnType<context = unknown> = UseMutationResult<
    connect.ReturnType,
    connect.ErrorType,
    connect.Parameters,
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
    void (async () => {
      provider.current ??=
        (await activeConnector.getProvider?.()) as EIP1193Provider
      provider.current?.on('message', (event) => {
        if (event.type !== 'permissionsChanged') return
        queryClient.invalidateQueries({ queryKey })
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

export function useVerifyEmail<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useVerifyEmail.Parameters<config, context> = {},
): useVerifyEmail.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return verifyEmail(config as Config, variables)
    },
    mutationKey: ['verifyEmail'],
  })
}

export declare namespace useVerifyEmail {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          verifyEmail.ReturnType,
          verifyEmail.ErrorType,
          verifyEmail.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    verifyEmail.ReturnType,
    verifyEmail.ErrorType,
    verifyEmail.Parameters<config>,
    context
  >
}
