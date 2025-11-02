import { type ReactNode, useCallback, useRef, useState } from 'react'
import { css, cx } from 'styled-system/css'
import LucideCopy from '~icons/lucide/copy'
import LucideCopyCheck from '~icons/lucide/copy-check'
import { Button } from '../Button/Button.js'
import { TextButton } from '../TextButton/TextButton.js'

export function CopyButton({
  className,
  iconPosition = 'end',
  label,
  size = 'small',
  value,
  variant = 'content',
}: CopyButton.Props) {
  const { copy, notifying } = CopyButton.useCopy()

  const Icon = notifying ? LucideCopyCheck : LucideCopy
  const label_ = CopyButton.getLabel(label, notifying)

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
      {iconPosition === 'start' && <Icon />}
      {label_ && <span>{label_}</span>}
      {iconPosition === 'end' && <Icon />}
    </Button>
  )
}

export namespace CopyButton {
  export type Props = {
    className?: string
    iconPosition?: 'start' | 'end'
    label?: Label
    size?: 'mini' | 'small' | 'medium' | 'large'
    value: string
    variant?: Button.Props['variant']
  }

  export type Label =
    | ReactNode
    | {
        normal: ReactNode
        copied: ReactNode
      }

  export function getLabel(label: Label, notifying: boolean) {
    return label && typeof label === 'object' && 'normal' in label
      ? notifying
        ? label.copied
        : label.normal
      : label
  }

  export function Text({
    className,
    iconPosition = 'end',
    label,
    value,
  }: Text.Props) {
    const { copy, notifying } = CopyButton.useCopy()

    const Icon = notifying ? LucideCopyCheck : LucideCopy
    const icon = <Icon className={css({ height: 14, width: 14 })} />
    const label_ = getLabel(label, notifying)

    return (
      <TextButton
        className={cx(
          className,
          css({
            alignItems: 'center',
            display: 'flex',
            fontSize: 13,
            gap: 8,
          }),
        )}
        onClick={() => copy(value)}
        title={notifying ? 'Copied' : 'Copy to clipboard'}
      >
        {iconPosition === 'start' && icon}
        {label_ && <span>{label_}</span>}
        {iconPosition === 'end' && icon}
      </TextButton>
    )
  }

  export namespace Text {
    export type Props = {
      className?: string
      iconPosition?: 'start' | 'end'
      label?: Label
      value: string
    }
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
