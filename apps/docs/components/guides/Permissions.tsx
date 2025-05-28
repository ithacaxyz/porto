import { useAccount, useChainId } from 'wagmi'
import { Connect } from '../Connect'
import { SendTip } from '../HomePage'

export function Example() {
  const account = useAccount()
  const chainId = useChainId()

  if (!account.isConnected) return <Connect signInText="Sign in to try" />
  return <SendTip address={account.address} chainId={chainId} next={() => {}} />
}
