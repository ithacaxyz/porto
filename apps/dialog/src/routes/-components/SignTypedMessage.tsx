import { Button, Frame } from '@porto/ui'
import { cx } from 'cva'
import { useChains } from 'wagmi'
import { CopyButton } from '~/components/CopyButton'
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
              frame.mode === 'dialog' && 'max-h-[200px]',
            )}
          >
            <div className="wrap-anywhere font-mono text-[12px] text-th_base leading-6">
              <div
                className="px-3 text-th_accent"
                title={`${data.domain.name} (${data.domain.version}) at ${chainId}`}
              >
                {data.domain.name}
              </div>
              {Object.entries(data.message)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => (
                  <SignTypedMessage.DataRow
                    key={key}
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
            Deny
          </Button>
          <Button
            loading={approving && 'Signing…'}
            onClick={onSign}
            variant="positive"
            width="grow"
          >
            Approve
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignTypedMessage {
  export type Props = {
    data: typeof TypedMessages.TypedMessageSchema.Type
    onSign: () => void
    onReject: () => void
    approving: boolean
  }

  export function DataRow({ keyName, value }: DataRow.Props) {
    let valueStr = String(value)
    if (valueStr === '[object Object]') valueStr = JSON.stringify(value)
    return (
      <div className="flex justify-between gap-[32px] pr-[12px] pl-[28px]">
        <div className="text-nowrap font-medium text-[14px] text-th_accent">
          {keyName}
        </div>
        <div className="flex h-[24px] min-w-0 flex-shrink items-center gap-[8px]">
          <div
            className="flex-shrink truncate text-nowrap text-[14px] text-th_base"
            title={valueStr}
          >
            {valueStr}
          </div>
          <CopyButton value={valueStr} />
        </div>
      </div>
    )
  }

  export namespace DataRow {
    export type Props = {
      keyName: string
      value: unknown
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
              frame.mode === 'dialog' && 'max-h-[200px]',
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
            Deny
          </Button>
          <Button
            loading={approving && 'Signing…'}
            onClick={onSign}
            variant="negative"
            width="grow"
          >
            Approve anyway
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
    chainId,
    deadline,
    spender,
    tokenContract,
    onSign,
    onReject,
    approving,
  } = props

  const chains = useChains()
  const chain = chains.find((c) => c.id === chainId)

  if (!chain)
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            icon={LucideLockKeyholeOpen}
            title="Authorize spend"
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
      chainId={chainId}
      expiresAt={new Date(deadline * 1000)}
      approving={approving}
      onApprove={onSign}
      onReject={onReject}
      spender={spender}
      tokenAddress={tokenContract}
    />
  )
}

export namespace SignPermit {
  export type Props = {
    amount: bigint
    chainId: number
    deadline: number
    approving: boolean
    onReject: () => void
    onSign: () => void
    spender: `0x${string}`
    tokenContract: `0x${string}`
  }
}
