import clsx from 'clsx'
import CircleAlertIcon from '~icons/lucide/circle-alert'
import CheckCircleIcon from '~icons/lucide/circle-check'

export function CustomToast({
  kind,
  title,
  description,
  className,
}: {
  title: string
  description: string | React.ReactNode
  className?: string | number
  kind: 'SUCCESS' | 'ERROR' | 'WARN'
}) {
  return (
    <div
      className={clsx(
        className,
        'm-1 w-[250px] rounded-xl border bg-white px-4 py-3 shadow-sm dark:bg-gray1',
        kind === 'SUCCESS' && 'border-green8',
        kind === 'ERROR' && 'border-red8',
        kind === 'WARN' && 'border-amber8',
      )}
    >
      <div className="flex items-center gap-x-2 pb-1.5">
        {(kind === 'SUCCESS' && (
          <CheckCircleIcon className="size-6 text-green8" />
        )) ||
          (kind === 'ERROR' && (
            <CircleAlertIcon className="size-6 text-red-500" />
          )) ||
          (kind === 'WARN' && (
            <CircleAlertIcon className="size-6 text-amber8" />
          ))}
        <span className="font-[550] text-gray12">{title}</span>
      </div>
      <div className="text-gray10 text-sm">{description}</div>
    </div>
  )
}
