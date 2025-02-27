import { cn } from '~/utils'

export function Pill({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'rounded-sm bg-gray4 px-1 py-0.5 text-gray9 text-xs tracking-tighter',
        className,
      )}
    >
      {children}
    </span>
  )
}
