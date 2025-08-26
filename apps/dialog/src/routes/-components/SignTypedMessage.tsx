import { useCopyToClipboard } from '@porto/apps/hooks'
import { Button, ButtonArea, Frame } from '@porto/ui'
import { cx } from 'cva'
import type * as TypedMessages from '~/lib/TypedMessages'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import LucideFileSignature from '~icons/lucide/file-signature'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
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
          content="Review the data to sign below."
          icon={LucideFileSignature}
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
              <div className="px-3 text-th_accent">{data.domain.name}</div>
              {Object.entries(data.message)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => (
                  <TypedMessageRow key={key} keyName={key} value={value} />
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

function TypedMessageRow({
  keyName,
  value,
}: {
  keyName: string
  value: unknown
}) {
  let valueStr = String(value)
  if (valueStr === '[object Object]') valueStr = JSON.stringify(value)

  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 500 })

  return (
    <div className="flex justify-between gap-[32px] pr-[12px] pl-[28px]">
      <div className="text-nowrap font-medium text-[14px] text-th_accent">
        {keyName}
      </div>
      <div className="flex h-[24px] min-w-0 flex-shrink items-center gap-[4px]">
        <div
          className="flex-shrink truncate text-nowrap text-[14px] text-th_base"
          title={valueStr}
        >
          {valueStr}
        </div>
        <ButtonArea
          className="flex flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] pb-[1px]"
          onClick={() => copyToClipboard(valueStr)}
          title={isCopied ? 'Copied' : 'Copy to clipboard'}
        >
          {isCopied ? (
            <LucideCopyCheck height={14} width={14} />
          ) : (
            <LucideCopy height={14} width={14} />
          )}
        </ButtonArea>
      </div>
    </div>
  )
}

export namespace SignTypedMessage {
  export type Props = {
    data: typeof TypedMessages.TypedMessageSchema.Type
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
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideLockKeyholeOpen}
          title="Grant Permissions"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg bg-th_base-alt p-3">
            {[
              ['Spend', data.domain.name || 'Unknown Token'],
              ['Amount', data.message.value?.toString()],
              [
                'Expires',
                new Date(Number(data.message.deadline) * 1000).toLocaleString(),
              ],
              ['Requested by', data.message.spender],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 font-medium text-[14px] text-th_base-secondary">
                  {label}
                </div>
                <div className="truncate text-[14px] text-th_base">{value}</div>
              </div>
            ))}
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
    onSign: () => void
    onReject: () => void
    isPending: boolean
  }
}
