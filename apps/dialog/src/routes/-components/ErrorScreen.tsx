import * as UI from '@porto/ui'
import { Actions } from 'porto/remote'
import type * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import * as DialogErrors from '~/lib/DialogErrors'
import { porto } from '~/lib/Porto'
import LucideBug from '~icons/lucide/bug'
import LucideOctagonAlert from '~icons/lucide/octagon-alert'
import LucideRefreshCw from '~icons/lucide/refresh-cw'
import { Layout } from './Layout'

export function ErrorScreen(props: ErrorScreen.Props) {
  const { dialogError, footer } = props

  const errorContext = ErrorScreen.useErrorContext()
  const errorDetails = DialogErrors.formatDialogError(dialogError, errorContext)

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideOctagonAlert}
          title={
            dialogError.type === 'call' ? 'Simulation error' : 'Error found'
          }
          variant="warning"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="flex flex-col gap-2 rounded-lg border border-th_warning bg-th_warning px-[12px] py-[10px] text-[14px] text-th_warning">
          <div className="font-medium">{dialogError.title}</div>
          <div className="max-h-[160px] overflow-auto">
            <pre className="break-all whitespace-pre-wrap font-sans text-[14px] text-th_base-secondary">
              {dialogError.message}
            </pre>
          </div>
          <div className="text-[13px]">
            <UI.CopyButton.Text
              iconPosition="start"
              label={{
                copied: 'Copied!',
                normal: 'Copy raw error',
              }}
              value={errorDetails}
            />
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        {footer || (
          <Layout.Footer.Actions>
            <UI.Button onClick={() => Actions.rejectAll(porto)}>
              Cancel
            </UI.Button>
            <UI.Button.Anchor
              external
              href={ErrorScreen.getBugReportMailto(
                dialogError.title,
                errorDetails,
              )}
              icon={<LucideBug className="size-[16px]" />}
              variant="warning"
              width="grow"
            >
              Report bug
            </UI.Button.Anchor>
          </Layout.Footer.Actions>
        )}
      </Layout.Footer>
    </Layout>
  )
}

export namespace ErrorScreen {
  export type Props = {
    dialogError: DialogErrors.DialogError
    footer?: React.ReactNode
  }

  export function useErrorContext(): DialogErrors.DialogErrorContext {
    const mode = Dialog.useStore((state) => state.mode)
    const referrer = Dialog.useStore((state) => state.referrer?.url)
    const [chainId] = porto._internal.store.getState().chainIds
    return {
      appVersion: __APP_VERSION__,
      chainId,
      mode,
      referrer: String(referrer),
      timestamp: new Date().toISOString(),
    }
  }

  export function getBugReportMailto(
    errorTitle: string,
    serializedError: string,
  ) {
    const subject = `Porto Error Report: ${errorTitle}`
    const body =
      'Please describe what you were doing when this error occurred:' +
      `\n\n\n\n---\nError Details:\n${serializedError}`

    return `mailto:support@ithaca.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  export function Execution(props: Execution.Props) {
    const { dialogError, onCancel, onRetry } = props

    return (
      <ErrorScreen
        dialogError={dialogError}
        footer={
          <Layout.Footer.Actions>
            <UI.Button onClick={onCancel} variant="secondary" width="grow">
              Cancel
            </UI.Button>
            <UI.Button
              icon={<LucideRefreshCw className="size-[16px]" />}
              onClick={onRetry}
              variant="secondary"
              width="grow"
            >
              Retry
            </UI.Button>
          </Layout.Footer.Actions>
        }
      />
    )
  }

  export namespace Execution {
    export type Props = {
      dialogError: DialogErrors.CallError | DialogErrors.RelayError
      onCancel: () => void
      onRetry: () => void
    }
  }
}
