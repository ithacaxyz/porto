import { useMutation } from '@tanstack/react-query'
import type { Porto } from 'porto'
import { codeToHtml } from 'shiki'
import { useAccount, useConnectors } from 'wagmi'

import { Button } from './Button'
import { Connect } from './Connect'

export function TryItOut(props: TryItOut.Props) {
  const {
    fn,
    requireConnection = true,
    transformResultCode = (x) => `const result = ${x}`,
  } = props

  const account = useAccount()
  const connectors = useConnectors()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )

  const mutation = useMutation({
    async mutationFn() {
      const json = await fn({
        provider:
          (await connector?.getProvider()) as unknown as Porto.Porto['provider'],
      })
      const html = await codeToHtml(
        transformResultCode(JSON.stringify(json, null, 2)),
        {
          lang: 'typescript',
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        },
      ).catch(() => undefined)
      return { html, json }
    },
  })

  if (requireConnection && !account.isConnected)
    return <Connect signInText="Sign in to try" />
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending
            ? 'Executing...'
            : mutation.data
              ? 'Try again'
              : 'Try it out'}
        </Button>
        {mutation.data ? (
          <Button variant="destructive" onClick={() => mutation.reset()}>
            Reset
          </Button>
        ) : null}
      </div>
      {mutation.data?.html ? (
        <div className="vocs_CodeBlock">
          <div className="vocs_Pre_wrapper">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: mutation.data.html }} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export namespace TryItOut {
  export interface Props {
    fn: (parameters: {
      provider: Porto.Porto['provider']
    }) => Promise<unknown>
    requireConnection?: boolean
    transformResultCode?: (code: string) => string
  }
}
