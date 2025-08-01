import { cx } from 'cva'
import { Spinner } from './Spinner'

export function IndeterminateLoader(props: IndeterminateLoader.Props) {
  const {
    align = 'horizontal',
    title,
    description = 'This will only take a few moments.',
    hint = 'Please do not close the window.',
    className,
  } = props
  return (
    <div className="space-y-2">
      <div
        className={cx(
          className,
          'flex items-center gap-2',
          align === 'vertical' && 'flex-col items-center gap-4',
        )}
      >
        <div
          className={cx(
            'flex size-8 items-center justify-center rounded-full bg-th_badge-info p-[6px] text-th_badge-info',
            align === 'vertical' && 'size-12',
          )}
        >
          <Spinner />
        </div>

        <div className="font-medium text-[18px] text-primary">{title}</div>
      </div>

      <div
        className={cx(
          'mt-1.5 text-[15px] leading-[20px]',
          align === 'vertical' && 'text-center',
        )}
      >
        <div className="text-primary">{description}</div>
        {hint && <div className="text-secondary">{hint}</div>}
      </div>
    </div>
  )
}

export declare namespace IndeterminateLoader {
  type Props = {
    align?: 'horizontal' | 'vertical'
    className?: string
    description?: string
    spinnerSize?: number
    title: string
    hint?: string
  }
}
