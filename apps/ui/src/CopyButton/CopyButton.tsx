import { useCallback, useRef, useState } from 'react'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import { css } from '../../styled-system/css'
import { ButtonArea } from '../ButtonArea/ButtonArea.js'

export function CopyButton({ size = 'small', value }: CopyButton.Props) {
  const { copy, notifying } = CopyButton.useCopy()

  const Icon = notifying ? LucideCopyCheck : LucideCopy

  if (size === 'small') size = 14

  return (
    <ButtonArea
      className={css({
        alignItems: 'center',
        borderRadius: 2,
        color: 'var(--text-color-th_base-secondary)',
        display: 'flex',
        flexShrink: 0,
        height: 16,
        justifyContent: 'center',
        paddingBottom: 1,
        position: 'relative',
        width: 16,
      })}
      onClick={() => copy(value)}
      title={notifying ? 'Copied' : 'Copy to clipboard'}
    >
      <Icon height={size} width={size} />
    </ButtonArea>
  )
}

export namespace CopyButton {
  export type Props = {
    size?: 'small' | number
    value: string
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
