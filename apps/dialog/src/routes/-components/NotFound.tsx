import { Button } from '@porto/ui'
import { useMutation } from '@tanstack/react-query'
import { Json } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'

export function NotFound() {
  const request = Hooks.useRequest(porto)

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={
            <>
              UI support for method "{request?.method}" is not implemented yet.
              You may still proceed by rejecting or responding.
            </>
          }
          icon={LucideTriangleAlert}
          title="Method Not implemented"
          variant="warning"
        />
      </Layout.Header>

      <Layout.Content>
        <pre className="max-h-[400px] overflow-scroll rounded-lg border border-th_base bg-th_base-alt p-3 text-[14px] text-th_base leading-[22px]">
          {Json.stringify(request ?? {}, null, 2)}
        </pre>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={respond.isPending}
            onClick={() => Actions.reject(porto, request!)}
            width="grow"
          >
            Reject
          </Button>

          <Button
            loading={respond.isPending && 'Responding…'}
            onClick={() => respond.mutate()}
            variant="negative"
            width="grow"
          >
            Respond
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}
