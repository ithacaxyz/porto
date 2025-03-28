import * as AriaKit from '@ariakit/react'
import { Button } from '@porto/apps/components'
import {
  exp1Abi,
  exp1Address,
  exp2Abi,
  exp2Address,
} from '@porto/apps/contracts'
import { cx } from 'cva'
import { AbiFunction, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'

import { Query } from '@porto/apps'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useSwapAssets } from '~/hooks/useSwapAssets'
import type { ChainId } from '~/lib/Wagmi'

const key = () =>
  ({
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    permissions: {
      calls: [
        {
          to: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
        },
      ],
      spend: [
        {
          limit: parseEther('50'),
          period: 'minute',
          token: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
        },
      ],
    },
  }) as const

export function DevOnly() {
  const account = useAccount()
  const permissions = Hooks.usePermissions()
  const grantPermissions = Hooks.useGrantPermissions()
  const revokePermissions = Hooks.useRevokePermissions()

  const { refetch: refetchAssets } = useSwapAssets({
    chainId: account.chainId as ChainId,
  })

  const send = useSendCalls({
    mutation: {
      onSuccess: () => refetchAssets(),
    },
  })

  const [open, setOpen] = React.useState(false)

  if (!account.isConnected) return null

  const ref = React.useRef<HTMLDivElement>(null)
  useClickOutside([ref], () => setOpen(false))

  return (
    <div>
      <AriaKit.Button
        onClick={() => setOpen(true)}
        className="absolute top-0 right-0 font-mono text-md text-transparent hover:text-gray11"
      >
        --
      </AriaKit.Button>
      <div className={cx(open ? 'block' : 'hidden')} ref={ref}>
        <div className="fixed right-0 bottom-0 flex h-fit max-w-full flex-col justify-start gap-x-2 bg-gray1 p-4 outline-none lg:mx-16 lg:max-w-1/2 lg:flex-row">
          <div className="grid w-full grid-cols-1 gap-x-2 lg:grid-cols-3">
            <Button
              variant="default"
              className="min-w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
              onClick={() => grantPermissions.mutate(key())}
            >
              Grant
            </Button>
            <Button
              variant="default"
              disabled={!permissions.data?.[0]}
              className="min-w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
              onClick={() => {
                if (permissions.data?.[0])
                  revokePermissions.mutate({ id: permissions.data[0].id })
              }}
            >
              Revoke
            </Button>
            <Button
              disabled={!account.address}
              className="min-w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
              variant="default"
              onClick={() => {
                if (!account.address) return
                console.info('minting EXP&EXP2')
                send.sendCalls({
                  calls: [
                    {
                      to: exp1Address,
                      data: AbiFunction.encodeData(
                        AbiFunction.fromAbi(exp1Abi, 'mint'),
                        [account.address, Value.fromEther('100')],
                      ),
                    },
                    {
                      to: exp2Address,
                      data: AbiFunction.encodeData(
                        AbiFunction.fromAbi(exp2Abi, 'mint'),
                        [account.address, Value.fromEther('100')],
                      ),
                    },
                  ],
                })

                console.info(send)
              }}
            >
              Mint EXP&EXP2
            </Button>
            <Button
              onClick={() => {
                Query.client
                  .invalidateQueries()
                  .then(() => Query.client.refetchQueries())
              }}
              variant="default"
              className="w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
            >
              refetch all
            </Button>
          </div>
          <pre className="text-xs">
            {JSON.stringify(
              {
                chain: { name: account.chain?.name, id: account.chainId },
              },
              undefined,
              2,
            )}
          </pre>
          <AriaKit.Button
            onClick={() => setOpen(false)}
            className="size-3 text-red-500"
          >
            ❌
          </AriaKit.Button>
        </div>
      </div>
    </div>
  )
}
