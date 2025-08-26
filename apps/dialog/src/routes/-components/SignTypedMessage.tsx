import { Button, Frame, ButtonArea } from '@porto/ui'
import type * as TypedMessages from '~/lib/TypedMessages'
import LucideFileSignature from '~icons/lucide/file-signature'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { cx } from 'cva'
import { Layout } from '../-components/Layout'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import { useCopyToClipboard } from '@porto/apps/hooks'

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

      <div className="p-[12px] pt-0 flex-grow flex-shrink">
        <div className="rounded-lg bg-th_base-alt py-2 flex-grow flex-shrink">
          <div className="pb-[4px] font-medium text-[12px] text-th_base-secondary px-[12px]">
            Contents
          </div>
          <div
            className={cx(
              'overflow-auto flex-grow flex-shrink',
              frame.mode === 'dialog' && 'max-h-[200px]',
            )}
          >
            <div className="wrap-anywhere font-mono text-[12px] text-th_base leading-6">
              <div className="text-th_accent px-3">{data.domain.name}</div>
              {Object.entries(data.message)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => (
                  <TypedMessageRow
                    key={key}
                    keyName={key}
                    value={value}
                    type={
                      data.types[data.primaryType]?.find((t) => t.name === key)
                        ?.type || 'unknown'
                    }
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

function TypedMessageRow({
  keyName,
  value,
  type,
}: {
  keyName: string
  value: unknown
  type: string
}) {
  let valueStr = String(value)
  if (valueStr === '[object Object]') valueStr = JSON.stringify(value)

  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 500 })

  return (
    <div className="flex gap-[32px] justify-between pl-[28px] pr-[12px]">
      <div className="font-medium text-[14px] text-th_accent text-nowrap">
        {keyName}
      </div>
      <div className="flex gap-[4px] items-center flex-shrink min-w-0 h-[24px]">
        <div
          className="text-[14px] text-th_base text-nowrap truncate flex-shrink"
          title={valueStr}
        >
          {valueStr}
        </div>
        <ButtonArea
          title={isCopied ? 'Copied' : 'Copy to clipboard'}
          className="h-[16px] w-[16px] pb-[1px] flex-shrink-0 flex rounded-[2px] flex items-center justify-center"
          onClick={() => copyToClipboard(valueStr)}
        >
          {isCopied ? (
            <LucideCopyCheck width={14} height={14} />
          ) : (
            <LucideCopy width={14} height={14} />
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
