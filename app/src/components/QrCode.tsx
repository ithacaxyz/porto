import { defineCustomElements } from '@bitjson/qr-code'
import * as React from 'react'
import { toast } from 'sonner'
import { useThemeMode } from '~/hooks/use-theme-mode'
import { cn } from '~/utils'

export function QrCode(props: {
  protocol?: string
  squares?: boolean
  contents?: string
  moduleColor?: string
  maskXToYRatio?: number
  positionRingColor?: string
  positionCenterColor?: string
  onCodeRendered?: (event: CustomEvent) => void
}) {
  const { theme } = useThemeMode()

  React.useEffect(() => defineCustomElements(window), [])

  return (
    <button
      type="button"
      className={cn(
        // 'outline outline-gray6',
        'mt-3 mb-4 size-full rounded-xl p-3 shadow-sm',
        // 'text-white' /  /
        'hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0',
        // theme === 'light' ? 'bg-white/75' : 'bg-white/90',
      )}
      onClick={() =>
        navigator.clipboard
          .writeText(props.contents ?? '')
          .then(() => toast.success('Copied to clipboard'))
          .catch(() => toast.error('Failed to copy to clipboard'))
      }
    >
      {/* @ts-ignore because it's a web component */}
      <qr-code key={props.contents} {...props} style={{ margin: '-15px' }}>
        <img
          src={
            theme === 'light'
              ? '/icons/ithaca-light.svg'
              : '/icons/ithaca-dark.svg'
          }
          alt="icon"
          slot="icon"
        />
        {/* @ts-ignore because it's a web component. This extra ts-ignore is on purpose. */}
      </qr-code>
    </button>
  )
}
