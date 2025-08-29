import { useCopyToClipboard } from '@porto/apps/hooks'
import { a, useTransition } from '@react-spring/web'
import LucideCopy from '~icons/lucide/copy'
import { ButtonArea } from '@porto/ui'
import LucideCopyCheck from '~icons/lucide/copy-check'

export function CopyButton({ value }: { value: string }) {
  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 800 })
  const transition = useTransition(isCopied ? LucideCopyCheck : LucideCopy, {
    config: { friction: 60, tension: 1600 },
    initial: { opacity: 1, transform: 'scale(1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    from: { opacity: 1, transform: 'scale(0.2)' },
    leave: { immediate: true, opacity: 0 },
  })
  return (
    <ButtonArea
      className="relative flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] pb-[1px] text-th_base-secondary"
      onClick={() => copyToClipboard(value)}
      title={isCopied ? 'Copied' : 'Copy to clipboard'}
    >
      {transition((style, Icon) => (
        <a.div className="absolute" style={style}>
          <Icon height={14} width={14} />
        </a.div>
      ))}
    </ButtonArea>
  )
}
