import { useAccount, useChainId } from 'wagmi'
import { Connect } from '../Connect'
import { BuyNow } from '../HomePage'

export function Example() {
  const account = useAccount()
  const chainId = useChainId()

  if (!account.isConnected) return <Connect signInText="Sign in to try" />
  return <BuyNow chainId={chainId} next={() => {}} />
}
