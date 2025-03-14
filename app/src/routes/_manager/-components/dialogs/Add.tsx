import DollarSignIcon from '~icons/majesticons/dollar-circle-line'

import { Dialog } from '~/components/ui/dialog'
import { cn } from '~/utils'

export function AddMoneyDialog({
  className,
}: {
  className?: string
}) {
  return (
    <Dialog>
      <Dialog.Trigger
        className={cn(
          className,
          'col-span-1 col-start-3',
          'sm:col-start-2 sm:row-span-1 sm:row-start-1',
          'w-[110px] text-center font-semibold text-lg sm:w-[120px] sm:text-md',
          'flex h-11! items-center justify-center gap-x-1 rounded-default px-3.5 text-center sm:h-11.5!',
        )}
      >
        <DollarSignIcon className="size-6" />
        Add
      </Dialog.Trigger>
      <Dialog.Content
        className="rounded-xl border-0 bg-primary p-5 shadow-xl sm:max-w-[400px]"
        title="Send"
      >
        <Dialog.Header className="p-0 text-center">Coming soon…</Dialog.Header>
      </Dialog.Content>
    </Dialog>
  )
}
