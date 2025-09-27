import { cx } from 'cva'

export const ChainIcon = (props: ChainIcon.Props) => {
  const { chainId, className } = props
  return (
    <img
      alt={`Chain ${chainId} icon`}
      className={cx(className, 'size-7')}
      src={`https://tokenlist.up.railway.app/icon/${chainId}`}
    />
  )
}

declare namespace ChainIcon {
  type Props = {
    chainId: number
    className?: string
  }
}
