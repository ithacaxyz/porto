import { AbiFunction, Json, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
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

const enableDevTools =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_ENABLE_DEV_TOOLS) === 'true'

export function DevOnly() {
  const account = useAccount()
  const permissions = Hooks.usePermissions()
  const revokePermissions = Hooks.useRevokePermissions()
  const grantPermissions = Hooks.useGrantPermissions()

  const send = useSendCalls()

  if (!enableDevTools) return null

  const isBusy =
    permissions.isPending ||
    revokePermissions.isPending ||
    grantPermissions.isPending

  if (isBusy) return <IndeterminateLoader title="cooking" />

  return (
    <div
      data-item="dev-tools"
      className="fixed bottom-0 left-0 w-full border-t border-t-gray6 bg-zinc-400 pt-1 pb-3 pl-3 *:text-black"
    >
      <pre className="mb-1">dev only</pre>

      <div className="flex gap-x-2">
        <Button
          variant="default"
          className="max-w-[200px] rounded-none!"
          onClick={() => grantPermissions.mutate(key())}
        >
          Grant permissions
        </Button>
        <Button
          variant="default"
          disabled={!permissions.data?.[0]}
          className="max-w-[200px] rounded-none!"
          onClick={() => {
            if (permissions.data?.[0])
              revokePermissions.mutate({ id: permissions.data[0].id })
          }}
        >
          Revoke permissions
        </Button>
        <Button
          disabled={!account.address}
          className="max-w-[200px] rounded-none!"
          variant="default"
          onClick={() => {
            if (!account.address) return

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
          }}
        >
          Mint EXP & EXP2
        </Button>
      </div>
      <details>
        <summary>permissions</summary>
        <pre>{Json.stringify(permissions?.data, null, 2)}</pre>
      </details>
    </div>
  )
}
