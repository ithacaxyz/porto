import { useMutation } from '@tanstack/react-query'
import { Json } from 'ox'
import type { Porto } from 'porto'
import { codeToHtml } from 'shiki'
import { type Client, createClient, custom } from 'viem'
import { useAccount, useConnectors } from 'wagmi'

import { Button } from './Button'
import { Connect } from './Connect'

export function TryItOut(props: TryItOut.Props) {
  const {
    exampleSlug,
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
      const provider =
        (await connector?.getProvider()) as unknown as Porto.Porto['provider']
      const client = createClient({
        transport: custom(provider),
      })
      const json = await fn({
        client,
        provider,
      })
      const html = await codeToHtml(
        transformResultCode(Json.stringify(json, null, 2)),
        {
          lang: 'typescript',
          themes: {
            dark: 'github-dark',
            light: 'github-light',
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
          <Button onClick={() => mutation.reset()} variant="destructive">
            Reset
          </Button>
        ) : null}
        {exampleSlug ? (
          <button
            className="vocs_Anchor underline-none"
            onClick={() => {
              const element = document.getElementById(exampleSlug.slice(1))
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            type="button"
          >
            See Example
          </button>
        ) : null}
      </div>
      {mutation.data?.html ? (
        <div className="vocs_CodeBlock">
          <div className="vocs_Pre_wrapper">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: _ */}
            <div dangerouslySetInnerHTML={{ __html: mutation.data.html }} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export namespace TryItOut {
  export interface Props {
    exampleSlug?: string
    fn: (parameters: {
      client: Client
      provider: Porto.Porto['provider']
    }) => Promise<unknown>
    requireConnection?: boolean
    transformResultCode?: (code: string) => string
  }
}
