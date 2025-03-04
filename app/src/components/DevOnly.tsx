import { Json } from 'ox'
import { Hooks } from 'porto/wagmi'
import { parseEther } from 'viem'
import { Button } from './Button'

const NON_PRODUCTION =
  import.meta.env.DEV || import.meta.env.VERCEL_ENV !== 'production'

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
  const permissions = Hooks.usePermissions()
  const revokePermissions = Hooks.useRevokePermissions()
  const grantPermissions = Hooks.useGrantPermissions()

  if (!NON_PRODUCTION) return null
  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-t-blackA8 bg-white pt-1 pb-3 pl-3">
      <pre className="mb-1">dev only</pre>

      <div className="flex gap-x-2">
        <Button
          variant="invert"
          className="max-w-[200px] rounded-none!"
          onClick={() => grantPermissions.mutate(key())}
        >
          Grant permissions
        </Button>
        <Button
          variant="invert"
          disabled={!permissions.data?.[0]}
          className="max-w-[200px] rounded-none!"
          onClick={() => {
            if (permissions.data?.[0])
              revokePermissions.mutate({ id: permissions.data[0].id })
          }}
        >
          Revoke permissions
        </Button>
      </div>
      <details>
        <summary>permissions</summary>
        <pre>{Json.stringify(permissions?.data, null, 2)}</pre>
      </details>
    </div>
  )
}
