import * as Ariakit from '@ariakit/react'
import * as React from 'react'
import XIcon from '~icons/lucide/x'
import DollarSignIcon from '~icons/majesticons/dollar-circle-line'

import { cx } from 'cva'

export function AddMoneyDialog({
  className,
}: {
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Ariakit.DialogProvider>
      <Ariakit.Button
        onClick={() => setIsOpen(true)}
        className={cx(
          className,
          'col-span-1 col-start-3',
          'sm:col-start-2 sm:row-span-1 sm:row-start-1',
          'w-[105px] text-center font-semibold text-lg sm:w-[120px] sm:text-md',
          'flex h-11 items-center justify-center gap-x-1 rounded-default px-3.5 text-center sm:h-11.5',
        )}
      >
        <DollarSignIcon className="size-6" />
        Add
      </Ariakit.Button>
      <Ariakit.Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={cx('dialog min-h-[200px] max-w-[400px]')}
        backdrop={<div className="bg-gray12/40 backdrop-blur-xs" />}
      >
        <div>
          <Ariakit.DialogHeading className="flex items-center justify-between">
            <span className="font-semibold text-xl">Send</span>
            <Ariakit.DialogDismiss className="text-secondary/50">
              <XIcon className="size-4" />
            </Ariakit.DialogDismiss>
          </Ariakit.DialogHeading>
          <Ariakit.DialogDescription className="p-0 text-center">
            Coming soon…
          </Ariakit.DialogDescription>
        </div>
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  )
}
