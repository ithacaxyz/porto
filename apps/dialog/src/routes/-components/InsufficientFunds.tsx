import { Button, ChainsPath, Details } from '@porto/ui'
import type { Address } from 'ox'
import { Layout } from '~/routes/-components/Layout'
import Star from '~icons/ph/star-four-bold'
import { ActionPreview } from './ActionPreview'

export function InsufficientFunds(props: InsufficientFunds.Props) {
  const { account, assetDeficit, chainId, onAddFunds, onReject } = props

  return (
    <ActionPreview
      account={account}
      actions={
        onAddFunds ? (
          <Layout.Footer.Actions>
            <Button
              onClick={onReject}
              variant="negative-secondary"
              width="grow"
            >
              Cancel
            </Button>
            <Button onClick={onAddFunds} variant="primary" width="grow">
              Add funds
            </Button>
          </Layout.Footer.Actions>
        ) : undefined
      }
      header={<Layout.Header.Default icon={Star} title="Insufficient funds" />}
      onReject={onReject}
      queryParams={{ address: account, chainId }}
      quotes={
        assetDeficit ? [{ assetDeficits: [assetDeficit], chainId }] : undefined
      }
    >
      <div className="flex flex-col gap-[8px]">
        <div className="space-y-3 overflow-hidden rounded-lg bg-th_base-alt px-3 py-3 text-[12px] text-th_base-secondary">
          This action requires funds to be added to your account before being
          able to proceed.
        </div>
        <Details opened>
          <Details.Item
            label="Network"
            value={<ChainsPath chainIds={[chainId]} />}
          />
        </Details>
      </div>
    </ActionPreview>
  )
}

export declare namespace InsufficientFunds {
  type Props = {
    account?: Address.Address
    assetDeficit?: {
      address: Address.Address
      decimals?: number
      deficit: bigint
      required: bigint
      symbol?: string
    }
    chainId: number
    onAddFunds?: () => void
    onReject: () => void
  }
}
