import { Button } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { Hex } from 'ox'
import type * as Address from 'ox/Address'
import { Key, Relay } from 'porto/internal'
import { Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import * as Price from '~/lib/Price'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import WalletIcon from '~icons/lucide/wallet-cards'
import { useQuote } from './ActionRequest'
import { PortoConfig } from '@porto/apps'
import * as React from 'react'

export function GrantAdmin(props: GrantAdmin.Props) {
  const { authorizeKey, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto)
  const client = Hooks.useClient(porto)
  const chain = Hooks.useChain(porto)

  const feeToken = React.useMemo(() => {
    if (!chain) return undefined
    const address = PortoConfig.feeToken[chain.id]
    return address
  }, [chain])

  const prepareCalls = useQuery({
    enabled: !!account && !!chain,
    queryFn: async () => {
      if (!account || !chain) throw new Error('Account and chain required')

      const adminKey = account.keys?.find(
        (key) => key.role === 'admin' && key.privateKey,
      )
      if (!adminKey) throw new Error('Admin key not found')

      const { context } = await Relay.prepareCalls(client, {
        account,
        authorizeKeys: [Key.from({ ...authorizeKey })],
        feeToken,
        key: adminKey,
      })

      return context
    },
    queryKey: [
      'prepareCalls',
      'grantAdmin',
      account?.address,
      authorizeKey.publicKey,
    ],
  })

  const quote = useQuote(porto, {
    chainId: chain?.id,
    context: prepareCalls.data,
  })

  const fiatFee = Price.useFiatPrice({
    value: quote?.fee.native.value,
  })

  return (
    <Layout loading={loading} loadingTitle="Authorizing...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            <div>
              You will allow this account to recover your passkey if it is ever
              lost.
            </div>
          }
          title="Add backup method"
        />
      </Layout.Header>
      <Layout.Content>
        <div className="flex items-center justify-center rounded-md bg-surface p-2">
          {account?.address && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jade4">
                <WalletIcon className="h-4 w-4 text-jade9" />
              </div>
              <span className="font-medium font-mono text-base">
                {StringFormatter.truncate(authorizeKey.publicKey)}
              </span>
            </div>
          )}
        </div>
      </Layout.Content>

      <Layout.Content>
        <p className="mb-1 text-base text-gray-500">More details</p>
        <div className="space-y-2 rounded-md bg-surface p-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Fees (est.)</span>
            <div className="text-right">
              {fiatFee.isFetched ? (
                <>
                  <div className="font-medium">{fiatFee.data?.display}</div>
                  {quote?.fee && (
                    <div>
                      <span className="text-secondary text-xs">
                        {quote.fee.display}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <span className="font-medium text-secondary">Loading...</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Duration (est.)</span>
            <span>2 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Network</span>
            <span className="flex items-center gap-1">
              <img
                alt={chain?.name}
                className="h-4 w-4"
                src={`/icons/${chain?.nativeCurrency.symbol.toLowerCase()}.svg`}
              />
              {chain?.name}
            </span>
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button className="flex-1" onClick={onReject} type="button">
            Cancel
          </Button>

          <Button
            className="flex-1"
            onClick={onApprove}
            type="button"
            variant="accent"
          >
            Add
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace GrantAdmin {
  type Props = {
    authorizeKey: {
      publicKey: Hex.Hex
      type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256'
    }
    feeToken?: Address.Address | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
  }
}
