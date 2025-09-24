import { type ReactNode, useCallback, useRef, useState } from 'react'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import { Button } from '../Button/Button.js'

export function CopyButton({
  className,
  label,
  size = 'small',
  value,
  variant = 'content',
}: CopyButton.Props) {
  const { copy, notifying } = CopyButton.useCopy()

  const Icon = notifying ? LucideCopyCheck : LucideCopy

  return (
    <Button
      className={className}
      onClick={() => copy(value)}
      shape={label ? 'normal' : 'square'}
      size={size === 'mini' ? 'small' : size}
      style={
        size === 'mini'
          ? { height: 22, outlineOffset: 0, width: 22 }
          : undefined
      }
      title={notifying ? 'Copied' : 'Copy to clipboard'}
      variant={variant}
    >
      {label && <span>{label}</span>}
      <Icon />
    </Button>
  )
}

export namespace CopyButton {
  export type Props = {
    className?: string
    label?: ReactNode
    size?: 'mini' | 'small' | 'medium' | 'large'
    value: string
    variant?: Button.Props['variant']
  }

  export function useCopy(timeout = 800) {
    const [notifying, setNotifying] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const copy = useCallback(
      async (value: string) => {
        if (timer.current) clearTimeout(timer.current)
        try {
          if (!navigator.clipboard)
            throw new Error('Clipboard API not supported')
          await navigator.clipboard.writeText(value)
          setNotifying(true)
          timer.current = setTimeout(() => setNotifying(false), timeout)
        } catch (error) {
          console.error('Failed to copy text: ', error)
        }
      },
      [timeout],
    )

    return { copy, notifying }
  }
}
