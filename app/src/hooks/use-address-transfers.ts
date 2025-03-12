import { useQuery } from '@tanstack/react-query'
import type { Address } from 'ox'
import { useAccount } from 'wagmi'

// const ODYSSEY_TESTNET_URL = 'http://explorer.ithaca.xyz'
const OPTIMISM_SEPOLIA_URL = 'https://optimism-sepolia.blockscout.com'

export const useAddressTransfers = ({
  address,
}: {
  address: Address.Address
}) => {
  const account = useAccount()

  const userAddress = address ?? account.address

  const { data, status, error, refetch } = useQuery({
    queryKey: ['token-transfers', userAddress],
    queryFn: async () => {
      const BASE_URL = `${OPTIMISM_SEPOLIA_URL}/api/v2`
      const response = await fetch(
        `${BASE_URL}/addresses/${userAddress}/token-transfers`,
      )
      const data = await response.json()
      return data
    },
  })

  return { data, status, error, refetch }
}
