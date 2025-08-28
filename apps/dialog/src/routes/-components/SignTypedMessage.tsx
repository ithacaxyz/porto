import { useCopyToClipboard } from '@porto/apps/hooks'
import { Button, ButtonArea, Frame, Spinner, TokenIcon } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import { cx } from 'cva'
import { Value } from 'ox'
import { Chains } from 'porto'
import * as React from 'react'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import type * as TypedMessages from '~/lib/TypedMessages'
import { StringFormatter } from '~/utils'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import LucideInfo from '~icons/lucide/info'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import LucidePencilLine from '~icons/lucide/pencil-line'
import { Layout } from '../-components/Layout'

export function SignTypedMessage({
  data,
  onSign,
  onReject,
  isPending,
}: SignTypedMessage.Props) {
  const frame = Frame.useFrame()
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
                title={`${data.domain.name} (${data.domain.version}) at ${data.domain.chainId}`}
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
            disabled={isPending}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Deny
          </Button>
          <Button
            loading={isPending && 'Signing…'}
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
    isPending: boolean
  }

  export function CopyButton({ value }: { value: string }) {
    const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 800 })
    const transition = useTransition(isCopied ? LucideCopyCheck : LucideCopy, {
      config: { friction: 60, tension: 1600 },
      enter: { opacity: 1, transform: 'scale(1)' },
      from: { opacity: 1, transform: 'scale(0.2)' },
      leave: { immediate: true, opacity: 0 },
    })
    return (
      <ButtonArea
        className="relative flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] pb-[1px] text-th_base-secondary"
        onClick={() => copyToClipboard(value)}
        title={isCopied ? 'Copied' : 'Copy to clipboard'}
      >
        {transition((style, Icon) => (
          <a.div className="absolute" style={style}>
            <Icon height={14} width={14} />
          </a.div>
        ))}
      </ButtonArea>
    )
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
  isPending,
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
            disabled={isPending}
            onClick={onReject}
            variant="secondary"
            width="grow"
          >
            Deny
          </Button>
          <Button
            loading={isPending && 'Signing…'}
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
    isPending: boolean
  }
}

export function SignPermit({
  data,
  onSign,
  onReject,
  isPending,
}: SignPermit.Props) {
  const tokenContract = data.domain.verifyingContract
  const tokenResult = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: tokenContract as `0x${string}`,
        functionName: 'decimals',
      },
      {
        abi: erc20Abi,
        address: tokenContract as `0x${string}`,
        functionName: 'symbol',
      },
    ],
    query: {
      enabled: Boolean(tokenContract),
    },
  })

  const [decimals, symbol] = tokenResult.data || []

  const [showDetails, setShowDetails] = React.useState(false)

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
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[10px] rounded-th_medium bg-th_base-alt p-[10px]">
            <SignPermit.AllowanceRow
              amount={
                tokenResult.data &&
                Value.format(BigInt(data.message.value), decimals)
              }
              error={tokenResult.error}
              expiresAt={new Date(Number(data.message.deadline) * 1000)}
              loading={tokenResult.isLoading}
              symbol={symbol}
            />
            <hr className="-mx-[10px] border-th_separator" />
            <div className="flex flex-row items-center gap-4">
              <div className="whitespace-nowrap font-medium text-[14px] text-th_base-secondary">
                Requested by
              </div>
              <div
                className="flex flex-grow items-center justify-end gap-2 truncate text-[14px] text-th_base"
                title={data.message.spender}
              >
                {StringFormatter.truncate(data.message.spender)}
                <SignTypedMessage.CopyButton value={data.message.spender} />
              </div>
            </div>
          </div>
          <div className="-mb-[4px]">
            {showDetails ? (
              <div className="flex h-[33px] w-full items-center justify-between gap-[6px] rounded-th_medium bg-th_base-alt px-[12px] text-[13px]">
                <span className="text-th_base-secondary">Network</span>
                <span className="font-medium text-th_base">
                  {Chains.all.find((c) => c.id === data.domain.chainId)?.name ||
                    'Unknown'}
                </span>
              </div>
            ) : (
              <ButtonArea
                className="flex h-[33px] w-full items-center justify-center gap-[6px] rounded-th_medium bg-th_base-alt text-[13px] text-th_base-secondary"
                onClick={() => setShowDetails(true)}
              >
                <LucideInfo className="size-4" />
                <span>Show more details</span>
              </ButtonArea>
            )}
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={isPending}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Deny
          </Button>
          <Button
            disabled={tokenResult.isLoading || tokenResult.isError}
            loading={isPending && 'Approving…'}
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

export namespace SignPermit {
  export type Props = {
    data: typeof TypedMessages.PermitSchema.Type
    isPending: boolean
    onReject: () => void
    onSign: () => void
  }

  export function AllowanceRow({
    amount,
    error,
    expiresAt,
    loading,
    symbol,
  }: AllowanceRow.Props) {
    const loadingTransition = useTransition(
      { error, loading },
      {
        config: { friction: 60, tension: 1600 },
        enter: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(0.95)' },
        initial: { opacity: 1, transform: 'scale(1)' },
        keys: `${loading}-${error}`,
        leave: { immediate: true, opacity: 0 },
      },
    )
    return (
      <div className="relative flex h-[36px] items-center text-th_base">
        {loadingTransition((style, { loading, error }) =>
          loading || error ? (
            <a.div
              className="absolute grid h-full w-full select-none place-items-center"
              style={style}
            >
              <div className="flex items-center gap-2">
                {error ? (
                  <>{String(error)} </>
                ) : (
                  <>
                    <Spinner /> fetching data…
                  </>
                )}
              </div>
            </a.div>
          ) : (
            <a.div
              className="absolute flex h-full w-full items-center gap-[8px]"
              style={style}
            >
              <TokenIcon className="shrink-0" symbol={symbol} />
              <div className="flex flex-1 flex-col gap-[4px]">
                <div className="text-nowrap font-medium text-[14px]">
                  Spend {symbol}
                </div>
                <div className="text-nowrap text-[12px] text-th_base-secondary">
                  Expires{' '}
                  <time
                    className="font-[600]"
                    dateTime={expiresAt.toISOString()}
                    title={expiresAt.toLocaleString('en-US')}
                  >
                    {expiresAt.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </time>
                </div>
              </div>
              <div className="truncate font-medium text-[13px] text-th_base-secondary">
                {Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 4,
                }).format(Number(amount))}
              </div>
            </a.div>
          ),
        )}
      </div>
    )
  }

  export namespace AllowanceRow {
    export type Props = {
      amount?: string | undefined
      error: Error | null
      expiresAt: Date
      loading: boolean
      symbol?: string | undefined
    }
  }
}
