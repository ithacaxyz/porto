import type { ReactNode } from 'react'

export function DemoBrowser({
  children,
  initialHeight = 600,
}: {
  children: ReactNode
  initialHeight?: number
}) {
  return (
    <div
      className="relative flex w-[360px] min-w-[360px] resize flex-col overflow-hidden rounded-t-th_large border border-[#ccc] dark:border-[#444]"
      style={{
        height: initialHeight,
      }}
    >
      <div className="flex h-10 shrink-0 items-center bg-[#f1f1f1] dark:bg-[#333]">
        <div className="flex items-center gap-1 px-3">
          <span className="h-2 w-2 rounded-full bg-[#ccc] dark:bg-[#555]" />
          <span className="h-2 w-2 rounded-full bg-[#ccc] dark:bg-[#555]" />
          <span className="h-2 w-2 rounded-full bg-[#ccc] dark:bg-[#555]" />
        </div>
      </div>
      <div className="flex flex-1 overflow-auto">{children}</div>
    </div>
  )
}
