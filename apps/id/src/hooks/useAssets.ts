import type { Hex } from 'ox'
import { Hooks } from 'porto/wagmi'
import { formatUnits } from 'viem'
import type { ChainId } from '~/lib/Constants.ts'
import * as Wagmi from '~/lib/Wagmi.ts'

export function useFormattedAssets(props: useFormattedAssets.Props) {
  return Hooks.useAssets({
    account: props.account!,
    query: {
      enabled: !!props.account,
      select: (data) =>
        Object.entries(data).flatMap(([chainId, assets]) =>
          assets
            .filter((asset) => asset.balance > 0n && chainId !== '0')
            .map((asset) => ({
              ...asset,
              chainId: Number.parseInt(chainId, 10) as ChainId,
              chainName: Wagmi.getChainConfig(Number.parseInt(chainId, 10))
                ?.name,
              value:
                Number(
                  formatUnits(asset.balance, asset.metadata?.decimals ?? 18),
                ) * (asset.metadata?.fiat?.value ?? 0),
            })),
        ),
    },
  })
}

declare namespace useFormattedAssets {
  type Props = {
    account: Hex.Hex | undefined
  }
}
