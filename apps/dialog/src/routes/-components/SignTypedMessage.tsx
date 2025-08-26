import { Button } from '@porto/ui'
import type * as TypedMessages from '~/lib/TypedMessages'
import LucideFileSignature from '~icons/lucide/file-signature'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { Layout } from '../-components/Layout'

export function SignTypedMessage({
  data,
  onSign,
  onReject,
  isPending,
}: SignTypedMessage.Props) {
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

      <Layout.Content>
        <div className="rounded-lg bg-th_base-alt px-3 py-2">
          <div className="pb-2 font-medium text-[14px] text-th_base-secondary">
            Message
          </div>
          <div className="max-h-[200px] overflow-auto">
            <pre className="wrap-anywhere whitespace-pre-wrap font-mono text-[12px] text-th_base">
              {JSON.stringify(data, null, 2)}
            </pre>
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
