import { cx } from 'cva'

export function TruncatedAddress({
  address,
  className,
  start = 4,
  end = 4,
  ...restProps
}: {
  address: string
  className?: string
  start?: number
  end?: number
} & React.HTMLAttributes<HTMLDivElement>) {
  const left = address.slice(0, start)
  const right = address.slice(-end)
  if (!left || !right) return address
  return (
    <div
      className={cx(
        className,
        'flex flex-row items-center justify-center gap-x-0.5 font-medium font-mono text-sm tracking-[0.25px]',
      )}
      {...restProps}
    >
      <span className="text-gray12">{left}</span>
      <p className="mb-1 font-bold text-gray9">...</p>
      <span className="text-gray12">{right}</span>
    </div>
  )
}
