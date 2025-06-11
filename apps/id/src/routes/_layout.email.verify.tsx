import { Button } from '@porto/apps/components'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Address, Hex } from 'ox'
import { ServerActions } from 'porto/viem'
import * as React from 'react'
import * as v from 'valibot'
import { createClient } from 'viem'
import { useAccount, useConnect, useConnectors } from 'wagmi'
import LucideCheck from '~icons/lucide/check'
import LucideFingerprint from '~icons/lucide/fingerprint'
import LucideOctagonAlert from '~icons/lucide/octagon-alert'
import LucidePictureInPicture2 from '~icons/lucide/picture-in-picture-2'
import { config as portoConfig } from '../lib/Porto.ts'
import { Layout } from './-components/Layout.tsx'

export const Route = createFileRoute('/_layout/email/verify')({
  component: RouteComponent,
  head() {
    return {
      meta: [{ title: 'Verify Email' }],
    }
  },
  validateSearch: v.object({
    address: v.pipe(v.string(), v.check(Address.validate, 'Invalid address')),
    email: v.pipe(v.string(), v.email()),
    token: v.string(),
  }),
})

function RouteComponent() {
  const { chainId, status } = useAccount()
  const [connector] = useConnectors()
  const { address, email, token } = Route.useSearch()

  const connect = useConnect()
  const verifyEmail = useMutation<null, Error>({
    async mutationFn(variables) {
      const client = createClient({
        chain: portoConfig.chains.find((chain) => chain.id === chainId),
        pollingInterval: 1_000,
        transport: portoConfig.transports[chainId as never]!,
      })
      return await ServerActions.verifyEmail(client, {
        chainId: chainId as never,
        email,
        token,
        walletAddress: address as Address.Address,
      })
    },
    mutationKey: ['verifyEmail'],
    onSettled(data, error) {
      console.log({ data, error })
    },
  })

  const content = React.useMemo(() => {
    if (verifyEmail.status === 'idle')
      return {
        description:
          "When you're ready, we will ask you to sign from your Porto account.",
        icon: (
          <div className="flex size-15 items-center justify-center rounded-full bg-blue3">
            <LucideFingerprint className="size-7 text-blue9" />
          </div>
        ),
        subtext: "We just need to make sure it's you!",
        title: 'Signature required',
      }
    if (verifyEmail.status === 'success')
      return {
        icon: (
          <div className="flex size-15 items-center justify-center rounded-full bg-green3">
            <LucideCheck className="size-7 text-green9" />
          </div>
        ),
        subtext: (
          <>
            You can use <span className="text-gray12">{email}</span> to recover
            your passkey if it is lost, and we’ll send you occasional news about
            Porto.
          </>
        ),
        title: 'Email is verified',
      }
    return {
      icon: (
        <div className="flex size-15 items-center justify-center rounded-full bg-red3">
          <LucideOctagonAlert className="size-7 text-red10" />
        </div>
      ),
      subtext:
        'We could not verify ownership of the Porto account that you are linking this email to.',
      title: 'Signature failed',
    }
  }, [email, verifyEmail.status])

  return (
    <div className="flex h-full flex-col justify-between">
      <Layout.Header
        left={
          <div className="-tracking-[2.8%] font-medium text-gray9">
            Email verification
          </div>
        }
        right={<Button render={<Link to="/">Cancel</Link>} size="small" />}
      />

      <div className="mx-auto flex max-w-[356px] flex-col items-center gap-2.5">
        {content.icon}
        <h1 className="-tracking-[2.8%] text-center font-medium text-[27px] text-gray12">
          {content.title}
        </h1>
        {content.description && (
          <p className="-tracking-[2.8%] text-center text-[18px] text-gray12 leading-[24px]">
            {content.description}
          </p>
        )}
        <div className="-tracking-[2.8%] text-center text-[17px] text-gray10 leading-[24px]">
          {content.subtext}
        </div>
        {verifyEmail.status === 'success' ? (
          <Button
            className="mt-4 w-full "
            render={<Link to="/">Done</Link>}
            variant="accent"
          />
        ) : (
          <Button
            className="mt-4 flex w-full items-center gap-2"
            disabled={connect.isPending || verifyEmail.isPending}
            onClick={() => {
              if (status === 'disconnected')
                connect.connect({ connector: connector! })
              else verifyEmail.mutate()
            }}
            variant={
              connect.isPending || verifyEmail.isPending ? undefined : 'accent'
            }
          >
            {connect.isPending || verifyEmail.isPending ? (
              <>
                <LucidePictureInPicture2 className="size-5" />
                Check passkey prompt
              </>
            ) : status === 'disconnected' ? (
              'Sign in'
            ) : verifyEmail.status === 'error' ? (
              'Try again'
            ) : (
              'Continue'
            )}
          </Button>
        )}
      </div>

      <div />
    </div>
  )
}
