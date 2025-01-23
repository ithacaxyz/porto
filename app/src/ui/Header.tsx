import LucideX from '~icons/lucide/x'
import { useAppStore } from '../lib/app'
import { requestsStore } from '../lib/requests'

export function Header() {
  const hostname = useAppStore((state) => new URL(state.targetOrigin).hostname)
  return (
    <header className="flex items-center justify-between border-neutral-5/50 border-b px-3 pt-2 pb-1.5 dark:border-neutral-6/60">
      <div className="flex items-center gap-2">
        <div className="font-normal text-[14px] text-neutral-10 leading-[22px]">
          {hostname}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          const state = requestsStore.getState()
          const request = state.requests[0]
          if (request) state.reject(request)
        }}
        title="Close Dialog"
        className="-me-0.5 flex items-center justify-center rounded-md p-0.5 hover:bg-neutral-3 dark:hover:bg-neutral-4"
      >
        <LucideX className="size-4.5 text-neutral-12/50" />
      </button>
    </header>
  )
}
