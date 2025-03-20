import { Porto } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { useMutation } from '@tanstack/react-query'
import { Json } from 'ox'
import { Actions, Hooks } from 'porto/remote'

import { Layout } from '~/components/Layout'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'

const porto = Porto.porto

export function NotFound() {
  const request = Hooks.useRequest(porto)

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  return (
    <Layout loading={respond.isPending} loadingTitle="Responding...">
      <Layout.Header>
        <Layout.Header.Default
          title="Method Not implemented"
          icon={LucideTriangleAlert}
          content={
            <>
              UI support for method "{request?.request?.method}" is not
              implemented yet. You may still proceed by rejecting or responding.
            </>
          }
          variant="warning"
        />
      </Layout.Header>

      <Layout.Content>
        <pre className="max-h-[400px] overflow-scroll rounded-lg border border-primary bg-surface p-3 text-[14px] text-primary leading-[22px]">
          {Json.stringify(request?.request ?? {}, null, 2)}
        </pre>
      </Layout.Content>

      <Layout.Footer>
        <div className="flex gap-2 px-3">
          <Button
            className="flex-grow"
            type="button"
            onClick={() => Actions.reject(porto, request!)}
          >
            Reject
          </Button>

          <Button
            className="flex-grow"
            type="button"
            variant="warning"
            onClick={() => respond.mutate()}
          >
            Respond
          </Button>
        </div>
      </Layout.Footer>
    </Layout>
  )
}
