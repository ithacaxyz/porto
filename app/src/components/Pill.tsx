import { cn } from '~/utils'

export function Pill({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm bg-gray-50 px-1.5 py-0.75 font-medium text-gray10 text-xs ring-1 ring-gray-500/10 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  )
}
