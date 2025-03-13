import { Button as OurButton } from '~/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog'
import { cn } from '~/utils'
import DollarSignIcon from '~icons/majesticons/dollar-circle-line'

export function AddMoneyDialog({
  className,
}: {
  className?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <OurButton
          variant="default"
          className={cn(
            className,
            'col-span-1 col-start-3',
            'sm:col-start-2 sm:row-span-1 sm:row-start-1',
            'w-[110px] text-center font-semibold text-lg sm:w-[120px] sm:text-md',
            'flex h-11! items-center justify-center gap-x-1 rounded-default px-3.5 text-center sm:h-10',
          )}
        >
          <DollarSignIcon className="size-6" />
          <span>Add</span>
        </OurButton>
      </DialogTrigger>
      <DialogContent
        className="rounded-xl border-0 bg-primary p-5 shadow-xl sm:max-w-[400px]"
        title="Send"
      >
        <DialogHeader className="p-0 text-center">Comint soon…</DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
