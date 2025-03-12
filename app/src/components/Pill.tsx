import { cn } from '~/utils'

export function Pill({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm bg-gray5 px-1 py-0.5 font-medium text-gray9 text-xs ring-1 ring-gray6 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}
