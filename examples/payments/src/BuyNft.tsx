import type * as React from 'react'
import { parseEther } from 'viem'
import {
  type BaseError,
  useAccount,
  useSendCalls,
  useWaitForCallsStatus,
} from 'wagmi'
import { exp1Config, expNftConfig } from './contracts'

export function BuyNow() {
  const { status } = useAccount()
  const { data, isPending, sendCalls, error } = useSendCalls()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForCallsStatus({
      id: data?.id,
    })

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    sendCalls({
      calls: [
        {
          abi: exp1Config.abi,
          args: [expNftConfig.address, parseEther('10')],
          functionName: 'approve',
          to: exp1Config.address,
        },
        {
          abi: expNftConfig.abi,
          functionName: 'mint',
          to: expNftConfig.address,
        },
      ],
    })
  }

  return (
    <section
      style={{ opacity: status === 'disconnected' ? 0.5 : 1 }}
      title={
        status === 'disconnected'
          ? 'Connect your wallet to buy the sneaker'
          : ''
      }
    >
      <h2>Buy Now</h2>
      <img
        alt="Running Sneaker"
        src="/sneaker.png"
        style={{ height: '120px', width: '120px' }}
      />
      <form onSubmit={submit}>
        <button disabled={isPending} type="submit">
          {isPending ? 'Buying sneaker…' : 'Buy Now'}
        </button>
      </form>
      {data?.id && <div>Transaction Hash: {data.id}</div>}
      {isConfirming && 'Waiting for confirmation…'}
      {isConfirmed && 'Purchase complete!'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </section>
  )
}
