import { Button, Spinner } from '@porto/apps/components'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Hooks } from 'porto/remote'
import { useMemo, useState } from 'react'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { ValueFormatter } from '~/utils'
import LucideKey from '~icons/lucide/key-round'
import { NotFound } from './NotFound'

export function GrantPermissions(props: GrantPermissions.Props) {
  const { address, permissions, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })

  const [index, setIndex] = useState(0)

  if (!permissions?.spend) return <NotFound />
  if (permissions.spend.length === 0) return <NotFound />

  return (
    <Layout loading={loading} loadingTitle="Authorizing...">
      <GrantSpendPermission {...permissions.spend[index]!} />

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-1"
            onClick={onReject}
            type="button"
            variant="destructive"
          >
            Deny
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              if (index < permissions!.spend!.length - 1) setIndex(index + 1)
              else onApprove()
            }}
            type="button"
            variant="success"
          >
            Approve
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace GrantPermissions {
  type Props = RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'experimental_grantPermissions'
  >['0'] & {
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}

export function GrantSpendPermission(props: GrantSpendPermission.Props) {
  const { limit, period, token } = props

  const hostname = Dialog.useStore((state) => state.referrer?.origin.hostname)

  // TODO: handle errors
  const symbol = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'symbol',
    query: {
      enabled: !!token,
    },
  })
  const decimals = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'decimals',
    query: {
      enabled: !!token,
    },
  })

  const displayAmount = useMemo(() => {
    if (!decimals.data && token) return null
    return ValueFormatter.format(Hex.toBigInt(limit), decimals.data)
  }, [limit, decimals.data, token])

  return (
    <>
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>
              <span className="font-medium">{hostname}</span> would like
              permissions to spend the following amount:
            </div>
          }
          icon={LucideKey}
          title="Authorize Spending"
        />
      </Layout.Header>
      <Layout.Content>
        <div className="flex h-[40px] items-center justify-center gap-2 rounded-lg bg-surface p-2">
          {displayAmount || !token ? (
            <>
              <div className="mt-[2px]">
                <code>
                  {displayAmount} {symbol.data ?? 'ETH'}
                </code>
              </div>
              <div className="opacity-50">per {period}</div>
            </>
          ) : (
            <Spinner className="text-secondary" />
          )}
        </div>
      </Layout.Content>
    </>
  )
}

export declare namespace GrantSpendPermission {
  type Props = NonNullable<
    NonNullable<GrantPermissions.Props['permissions']>['spend']
  >[number]
}
