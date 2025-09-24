import type { Hex } from 'ox'
import { Hooks } from 'porto/wagmi'
import { formatUnits } from 'viem'
import type { ChainId } from '~/lib/Constants.ts'
import * as Wagmi from '~/lib/Wagmi.ts'

const tokenListURL = 'https://tokenlist.up.railway.app'

export function useFormattedAssets(props: useFormattedAssets.Props) {
  return Hooks.useAssets({
    account: props.account!,
    query: {
      enabled: !!props.account,
      select: (data) =>
        Object.entries(data).flatMap(([chainId, assets]) =>
          assets
            .filter((asset) => asset.balance > 0n && chainId !== '0')
            .map((asset) => {
              const parsedChainId = Number.parseInt(chainId, 10) as ChainId
              const symbol = asset.metadata?.symbol?.toLowerCase()
              return {
                ...asset,
                chainId: parsedChainId,
                chainName: Wagmi.getChainConfig(parsedChainId)?.name,
                icon: `${tokenListURL}/icon/${parsedChainId}/${symbol === 'exp' ? 'exp1' : symbol}`,
                value:
                  Number(
                    formatUnits(asset.balance, asset.metadata?.decimals ?? 18),
                  ) * (asset.metadata?.fiat?.value ?? 0),
              }
            }),
        ),
    },
  })
}

declare namespace useFormattedAssets {
  type Props = {
    account: Hex.Hex | undefined
  }
}
