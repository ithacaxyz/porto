import { cx } from 'cva'
import CircleAlertIcon from '~icons/lucide/circle-alert'
import CheckCircleIcon from '~icons/lucide/circle-check'

export function Toast(props: Toast.Props) {
  const { kind, title, description, className } = props
  return (
    <div
      className={cx(
        className,
        'm-1 w-[250px] rounded-xl border bg-white px-4 py-3 shadow-sm dark:bg-gray1',
        kind === 'success' && 'border-green8',
        kind === 'error' && 'border-red8',
        kind === 'warn' && 'border-amber8',
      )}
    >
      <div className="flex items-center gap-x-2 pb-1.5">
        {(kind === 'success' && (
          <CheckCircleIcon className="size-6 text-green8" />
        )) ||
          (kind === 'error' && (
            <CircleAlertIcon className="size-6 text-red-500" />
          )) ||
          (kind === 'warn' && (
            <CircleAlertIcon className="size-6 text-amber8" />
          ))}
        <span className="font-[550] text-gray12">{title}</span>
      </div>
      <div className="max-h-42 overflow-y-auto text-gray10 text-sm">
        {description}
      </div>
    </div>
  )
}

export declare namespace Toast {
  type Props = {
    title: string
    description: string | React.ReactNode
    className?: string | number
    kind: 'success' | 'error' | 'warn'
  }
}
