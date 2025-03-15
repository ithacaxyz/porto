import { cx } from 'cva'

export function Pill({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-sm bg-gray4 px-1 py-0.5 font-medium text-gray11 text-xs ring-1 ring-gray6 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}
