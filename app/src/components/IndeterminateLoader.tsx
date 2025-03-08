import { cn } from '~/utils'
import { Spinner } from './Spinner'

export function IndeterminateLoader(props: IndeterminateLoader.Props) {
  const {
    title,
    description = 'This will only take a few moments.',
    hint = 'Please do not close the window.',
    className,
  } = props
  return (
    <div className={cn(className, 'space-y-2')}>
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-accentTint p-[6px] text-accent">
          <Spinner />
        </div>

        <div className="font-medium text-[18px] text-primary">{title}</div>
      </div>

      <div className="mt-1.5 text-[15px] leading-[20px]">
        <div className="text-primary">{description}</div>
        {hint && <div className="text-secondary">{hint}</div>}
      </div>
    </div>
  )
}

export declare namespace IndeterminateLoader {
  type Props = {
    className?: string
    description?: string
    title: string
    hint?: string
  }
}
