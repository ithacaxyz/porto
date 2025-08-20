import { setTimeout } from 'node:timers/promises'
import { exp1Abi, exp1Address } from '@porto/apps/contracts'
import { Hono } from 'hono'
import { getConnInfo } from 'hono/cloudflare-workers'
import { validator } from 'hono/validator'
import { Chains } from 'porto'
import { createWalletClient, http, isAddress, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { waitForTransactionReceipt } from 'viem/actions'

const faucetApp = new Hono<{ Bindings: Cloudflare.Env }>()

const chains = {
  [Chains.baseSepolia.id]: Chains.baseSepolia,
  [Chains.optimismSepolia.id]: Chains.optimismSepolia,
} as const

faucetApp.all('*', async (context, next) => {
  const address = context.req.query('address')?.toLowerCase()
  if (!address || !isAddress(address))
    return context.json({ error: 'Valid EVM address required' }, 400)

  const ip =
    getConnInfo(context).remote.address ||
    context.req.header('cf-connecting-ip')
  const key = `${address}:${ip ?? ''}`
  if (!ip) return context.json({ error: 'Unable to process request' }, 400)

  const { success } = await context.env.RATE_LIMITER.limit({
    key,
  })
  if (!success) return context.json({ error: 'Rate limit exceeded' }, 429)

  await next()
})

faucetApp.on(
  ['GET', 'POST'],
  '/',
  validator('query', (values, context) => {
    const {
      address,
      chainId,
      value = '25',
      overrideTokenAddress,
    } = <Record<string, string>>values

    if (!address || !isAddress(address))
      return context.json({ error: 'Valid EVM address required' }, 400)

    if (
      !chainId ||
      !exp1Address[chainId as unknown as keyof typeof exp1Address]
    )
      return context.json({ error: 'Valid chainId required' }, 400)

    return { address, chainId, overrideTokenAddress, value: BigInt(value) }
  }),
  async (context) => {
    const { address, chainId, value } = context.req.valid('query')

    const account = privateKeyToAccount(context.env.DRIP_PRIVATE_KEY)
    const client = createWalletClient({
      account,
      chain: chains[chainId as unknown as keyof typeof chains],
      transport: http(),
    }).extend(publicActions)

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await client.estimateFeesPerGas()

    const hash = await client.writeContract({
      abi: exp1Abi,
      address: exp1Address[chainId as unknown as keyof typeof exp1Address],
      args: [address, value],
      functionName: 'mint',
      maxFeePerGas: maxFeePerGas * 2n,
      maxPriorityFeePerGas: maxPriorityFeePerGas * 2n,
    })

    const receipt = await waitForTransactionReceipt(client, {
      hash,
      pollingInterval: 1_000,
    })
    // TODO: remove once faucet in relay
    await setTimeout(2_000)

    if (receipt.status === 'success')
      return context.json({ id: receipt.transactionHash }, 200)

    return context.json(
      { error: receipt.status, id: receipt.transactionHash },
      500,
    )
  },
)

export { faucetApp }
