import { useQuery } from '@tanstack/react-query'
import { Address } from 'ox'
import { useAccount, useChainId } from 'wagmi'
import { addressApiEndpoint, urlWithLocalCorsBypass } from '~/lib/Constants'

export const useAddressTransfers = ({
  chainId: providedChainId,
  address,
}: {
  chainId?: number
  address?: Address.Address
} = {}) => {
  const account = useAccount()
  const connectedChainId = useChainId()

  const chainId = providedChainId ?? connectedChainId
  const userAddress = address ?? account.address

  const { data, status, error, refetch } = useQuery({
    queryKey: ['token-transfers', chainId, userAddress],
    enabled: !!userAddress && !!chainId && Address.validate(userAddress),
    queryFn: async () => {
      try {
        const apiEndpoint = addressApiEndpoint(chainId)
        const url = `${apiEndpoint}/addresses/${userAddress}/token-transfers`
        const response = await fetch(urlWithLocalCorsBypass(url))
        if (!response.ok) {
          throw new Error(
            `Failed to fetch token transfers: ${response.statusText}`,
          )
        }
        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching token transfers:', error)
        throw error
      }
    },
  })

  return { data, status, error, refetch }
}
