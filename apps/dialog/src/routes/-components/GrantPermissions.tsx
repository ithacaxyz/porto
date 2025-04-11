import { Button } from '@porto/apps/components'
import { type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import { Hooks } from 'porto/remote'
import { useState } from 'react'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideDiamondPlus from '~icons/lucide/diamond-plus'
import { NotFound } from './NotFound'
import { Permissions } from './Permissions'

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
          <Button className="flex-1" onClick={onReject} type="button">
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={() => {
              if (index < permissions!.spend!.length - 1) setIndex(index + 1)
              else onApprove()
            }}
            type="button"
            variant="accent"
          >
            Grant
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
  return (
    <>
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>You must update the following permissions to continue:</div>
          }
          icon={LucideDiamondPlus}
          title="Update permissions"
          variant="warning"
        />
      </Layout.Header>
      <Layout.Content className="pl-0">
        <Permissions calls={props.calls ?? []} spend={[props]} />
      </Layout.Content>
    </>
  )
}

export declare namespace GrantSpendPermission {
  type Props = NonNullable<
    NonNullable<GrantPermissions.Props['permissions']>['spend']
  >[number] & {
    calls?: readonly {
      signature?: string
      to?: `0x${string}`
    }[]
  }
}
