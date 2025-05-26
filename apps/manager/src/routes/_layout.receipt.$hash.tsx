import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getTransactionReceipt } from '@wagmi/core'
import { Address, Hex, Json } from 'ox'
import { config } from '~/lib/Wagmi'

const query = ({
  address,
  hash,
}: {
  address: Address.Address
  hash: Hex.Hex
}) => ({
  queryFn: () => getTransactionReceipt(config, { hash }),
  queryKey: ['receipt', address, hash],
})

export const Route = createFileRoute('/_layout/receipt/$hash')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      query({
        address: context.account.address as Address.Address,
        hash: params.hash as Hex.Hex,
      }),
    )
  },
})

function RouteComponent() {
  const { account } = Route.useRouteContext()
  const { hash } = Route.useParams()
  const { data } = useSuspenseQuery(
    query({
      address: account.address as Address.Address,
      hash: hash as Hex.Hex,
    }),
  )
  return (
    <section className="-ml-24">
      <pre className="text-sm">{Json.stringify(data, null, 2)}</pre>
    </section>
  )
}
