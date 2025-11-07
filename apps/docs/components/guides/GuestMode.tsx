import { exp1Config } from '@porto/apps/contracts'
import type { Porto } from 'porto'
import * as React from 'react'
import { parseUnits } from 'viem'
import { writeContract } from 'viem/actions'
import { baseSepolia } from 'viem/chains'
import { useConnectors } from 'wagmi'
import { Button } from '../Button'

export function Example() {
  const [hash, setHash] = React.useState<string | null>(null)
  const [isPending, setIsPending] = React.useState(false)
  const connector = useConnectors().find((c) => c.id === 'xyz.ithaca.porto')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!connector) return

    setIsPending(true)
    setHash(null)

    try {
      const provider = (await connector.getProvider({
        chainId: baseSepolia.id,
      })) as Porto.Porto['provider']

      // ensure guest mode
      await provider.request({ method: 'wallet_disconnect' })

      const txHash = await writeContract(provider as any, {
        abi: exp1Config.abi,
        account: null,
        address: exp1Config.address[baseSepolia.id],
        args: [
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          parseUnits('10', 18),
        ],
        chain: baseSepolia,
        functionName: 'transfer',
      })

      setHash(txHash)
    } catch (error_) {
      const error = error_ as Error
      if (!error.message.includes('User rejected'))
        console.error('Transaction error:', error)
    } finally {
      setIsPending(false)
    }
  }

  if (hash)
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full max-w-md items-center justify-center gap-3">
          <div className="-tracking-[2.8%] text-[16px] text-gray11 leading-normal dark:text-gray10">
            Transaction sent.
          </div>
          <Button onClick={() => setHash(null)} size="small" type="button">
            Restart
          </Button>
        </div>
      </div>
    )

  return (
    <div className="flex w-full items-center justify-center">
      <form onSubmit={handleSubmit}>
        <Button disabled={isPending} type="submit" variant="accent">
          {isPending ? 'Sending…' : 'Send 10 EXP as guest'}
        </Button>
      </form>
    </div>
  )
}
