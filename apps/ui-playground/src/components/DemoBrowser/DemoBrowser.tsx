import type { ReactNode } from 'react'

export function DemoBrowser({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-[360px] min-w-[360px] resize flex-col overflow-hidden rounded-t-th_large border border-[#ccc]">
      <div className="flex h-10 shrink-0 items-center bg-[#f1f1f1]">
        <div className="flex items-center gap-1 px-3">
          <span className="h-2 w-2 rounded-full bg-[#ccc]" />
          <span className="h-2 w-2 rounded-full bg-[#ccc]" />
          <span className="h-2 w-2 rounded-full bg-[#ccc]" />
        </div>
      </div>
      <div className="flex flex-1 overflow-auto">{children}</div>
    </div>
  )
}
