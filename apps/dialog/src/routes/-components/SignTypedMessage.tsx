import { Button, CopyButton, Frame } from '@porto/ui'
import { cx } from 'cva'
import * as React from 'react'
import { maxUint160 } from 'viem'
import { useChains } from 'wagmi'
import type * as z from 'zod/mini'
import type * as TypedMessages from '~/lib/TypedMessages'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import LucidePencilLine from '~icons/lucide/pencil-line'
import { Layout } from '../-components/Layout'
import { Approve } from './Approve'

export function SignTypedMessage({
  data,
  onSign,
  onReject,
  approving,
}: SignTypedMessage.Props) {
  const frame = Frame.useFrame()
  const chainId = Number(data.domain.chainId)

  const messageEntries = React.useMemo(
    () => SignTypedMessage.flattenMessage(data.message),
    [data.message],
  )

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content="Review the message to sign below."
          icon={LucidePencilLine}
          title="Sign message"
          variant="default"
        />
      </Layout.Header>

      <div className="flex-shrink flex-grow p-[12px] pt-0">
        <div className="flex-shrink flex-grow rounded-lg bg-th_base-alt py-2">
          <div className="px-[12px] pb-[4px] font-medium text-[12px] text-th_base-secondary">
            Contents
          </div>
          <div
            className={cx(
              'flex-shrink flex-grow overflow-auto',
              frame.mode === 'dialog' && 'max-h-[192px]',
            )}
          >
            <div className="wrap-anywhere font-mono text-[12px] text-th_base leading-6">
              <div
                className="px-3 text-th_accent"
                title={`${data.domain.name} (${data.domain.version}) at ${chainId}`}
              >
                {data.domain.name}
              </div>
              {messageEntries.map(([key, value, depth], index) => (
                <SignTypedMessage.DataEntry
                  depth={depth}
                  // biome-ignore lint/suspicious/noArrayIndexKey: _
                  key={index}
                  keyName={key}
                  value={value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={approving}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Cancel
          </Button>
          <Button
            loading={approving && 'Signing…'}
            onClick={onSign}
            variant="positive"
            width="grow"
          >
            Sign
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignTypedMessage {
  export type Props = {
    data: z.infer<typeof TypedMessages.TypedMessageSchema>
    onSign: () => void
    onReject: () => void
    approving: boolean
  }

  export function flattenMessage(
    obj: {},
    depth = 1,
  ): Array<[key: string, value: string, depth: number]> {
    return Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([k, v]) => {
        const isObj = v && typeof v === 'object' && !Array.isArray(v)
        return [
          [
            k,
            isObj && depth === 1 ? '' : isObj ? JSON.stringify(v) : String(v),
            depth,
          ],
          ...(isObj && depth === 1 ? flattenMessage(v, depth + 1) : []),
        ]
      })
  }

  export function DataEntry({ keyName, value, depth = 1 }: DataEntry.Props) {
    return (
      <div
        className="flex justify-between gap-[32px] pr-[12px]"
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        <div className="text-nowrap font-medium text-[14px] text-th_accent">
          {keyName}
        </div>
        {value && (
          <div className="flex h-[24px] min-w-0 flex-shrink items-center gap-[8px]">
            <div
              className="flex-shrink truncate text-nowrap text-[14px] text-th_base"
              title={value}
            >
              {value}
            </div>
            <CopyButton value={value} />
          </div>
        )}
      </div>
    )
  }

  export namespace DataEntry {
    export type Props = {
      keyName: string
      value: string
      depth?: number
    }
  }
}

export function SignTypedMessageInvalid({
  data,
  onSign,
  onReject,
  approving,
}: SignTypedMessageInvalid.Props) {
  const frame = Frame.useFrame()
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content="The message format appears to be invalid."
          icon={LucidePencilLine}
          title="Sign message"
          variant="default"
        />
      </Layout.Header>

      <div className="flex-shrink flex-grow p-[12px] pt-0">
        <div className="flex-shrink flex-grow rounded-lg bg-th_base-alt py-2">
          <div className="px-[12px] pb-[4px] font-medium text-[12px] text-th_base-secondary">
            Contents
          </div>
          <div
            className={cx(
              'flex-shrink flex-grow overflow-auto',
              frame.mode === 'dialog' && 'max-h-[192px]',
            )}
          >
            <div className="wrap-anywhere px-[12px] font-mono text-[12px] text-th_base-secondary leading-6">
              {data}
            </div>
          </div>
        </div>
      </div>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={approving}
            onClick={onReject}
            variant="secondary"
            width="grow"
          >
            Cancel
          </Button>
          <Button
            loading={approving && 'Signing…'}
            onClick={onSign}
            variant="negative"
            width="grow"
          >
            Sign anyway
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignTypedMessageInvalid {
  export type Props = {
    data: string
    onSign: () => void
    onReject: () => void
    approving: boolean
  }
}

export function SignPermit(props: SignPermit.Props) {
  const {
    amount,
    approving,
    chainId,
    deadline,
    onReject,
    onSign,
    permitType,
    spender,
    tokenContract,
  } = props

  const chains = useChains()
  const chain = chains.find((c) => c.id === chainId)

  if (!chain)
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            icon={LucideLockKeyholeOpen}
            title="Allow spend"
            variant="default"
          />
        </Layout.Header>
        <Layout.Content>
          <div className="flex items-center gap-2 p-4">
            <div className="text-sm text-th_base-secondary">
              Error: the specified chain is not supported.
            </div>
          </div>
        </Layout.Content>
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              onClick={onReject}
              variant="negative-secondary"
              width="grow"
            >
              Cancel
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )

  return (
    <Approve
      amount={amount}
      approving={approving}
      chainsPath={[chain]}
      expiresAt={new Date(deadline * 1000)}
      onApprove={onSign}
      onReject={onReject}
      spender={spender}
      tokenAddress={tokenContract}
      unlimited={permitType === 'permit2' ? amount >= maxUint160 : undefined}
    />
  )
}

export namespace SignPermit {
  export type Props = {
    amount: bigint
    approving: boolean
    chainId: number
    deadline: number
    onReject: () => void
    onSign: () => void
    permitType: 'erc-2612' | 'permit2'
    spender: `0x${string}`
    tokenContract: `0x${string}`
  }
}
