import { createFileRoute } from '@tanstack/react-router'
import * as Dialog from '~/lib/Dialog'
import CheckIcon from '~icons/lucide/check'
import { Layout } from '../-components/Layout'

export const Route = createFileRoute('/dialog/success')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      content: search.content as string | undefined,
      title: search.title as string,
    }
  },
})

function RouteComponent() {
  const {
    content = 'This action was performed successfully.',
    title = 'Success',
  } = Route.useSearch()
  const url = Dialog.useStore((state) => state.referrer?.url)

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={content}
          icon={CheckIcon}
          subContent={
            'You may now close this window' +
            (url?.toString().startsWith('cli')
              ? ' and return to the command line'
              : '') +
            '.'
          }
          title={title}
          variant="success"
        />
      </Layout.Header>
    </Layout>
  )
}
