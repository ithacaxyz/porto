import { AbiFunction, Json, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import { Drawer } from 'vaul-base'
import { parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'

import { ExperimentERC20 } from '~/lib/Constants'
import { Button } from './Button'
import { IndeterminateLoader } from './IndeterminateLoader'

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
  const revokePermissions = Hooks.useRevokePermissions()
  const grantPermissions = Hooks.useGrantPermissions()

  const send = useSendCalls()

  const isBusy =
    permissions.isPending ||
    revokePermissions.isPending ||
    grantPermissions.isPending

  if (isBusy) return <IndeterminateLoader title="cooking" />

  return (
    <Drawer.Root>
      <Drawer.Trigger className="absolute top-0 right-0 p-4 font-mono text-gray11 text-md sm:p-3">
        {import.meta.env.DEV ? 'dev tools' : ''}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 h-fit bg-gray-100 outline-none">
          <div className="bg-white p-4">
            <div className="flex justify-center gap-x-2">
              <Button
                variant="default"
                className="w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
                onClick={() => grantPermissions.mutate(key())}
              >
                Grant
              </Button>
              <Button
                variant="default"
                disabled={!permissions.data?.[0]}
                className="w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
                onClick={() => {
                  if (permissions.data?.[0])
                    revokePermissions.mutate({ id: permissions.data[0].id })
                }}
              >
                Revoke
              </Button>
              <Button
                disabled={!account.address}
                className="w-[120px] max-w-[200px] rounded-none! text-xs sm:w-auto sm:text-base"
                variant="default"
                onClick={() => {
                  if (!account.address) return
                  console.info('minting EXP&EXP2')
                  send.sendCalls({
                    calls: [
                      {
                        to: ExperimentERC20.address[0],
                        data: AbiFunction.encodeData(
                          AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
                          [account.address, Value.fromEther('100')],
                        ),
                      },
                      {
                        to: ExperimentERC20.address[1],
                        data: AbiFunction.encodeData(
                          AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
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
            </div>
            <details className="ml-12 overflow-auto text-black">
              <summary>permissions</summary>
              <pre>{Json.stringify(permissions?.data, null, 2)}</pre>
            </details>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
