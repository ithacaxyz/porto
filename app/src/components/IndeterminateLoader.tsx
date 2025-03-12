import { cn } from '~/utils'
import { Spinner } from './Spinner'

export function IndeterminateLoader(props: IndeterminateLoader.Props) {
  const {
    title,
    description = 'This will only take a few moments.',
    hint = 'Please do not close the window.',
    className,
    spinnerSize = 8,
  } = props
  return (
    <div className="space-y-2">
      <div className={cn(className, 'flex items-center gap-2')}>
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-accentTint p-[6px] text-accent',
            `size-${spinnerSize}`,
          )}
        >
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
    spinnerSize?: number
    title: string
    hint?: string
  }
}
