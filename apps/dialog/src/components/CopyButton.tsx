import { useCopyToClipboard } from '@porto/apps/hooks'
import { ButtonArea } from '@porto/ui'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'

export function CopyButton({ value }: { value: string }) {
  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 800 })
  const Icon = isCopied ? LucideCopyCheck : LucideCopy

  return (
    <ButtonArea
      className="relative flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-[2px] pb-[1px] text-th_base-secondary"
      onClick={() => copyToClipboard(value)}
      title={isCopied ? 'Copied' : 'Copy to clipboard'}
    >
      <div className="absolute">
        <Icon height={14} width={14} />
      </div>
    </ButtonArea>
  )
}
