import { defineCustomElements } from '@bitjson/qr-code'
import * as React from 'react'
import { toast } from 'sonner'

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
  React.useEffect(() => defineCustomElements(window), [])

  return (
    <button
      type="button"
      className="mt-3 mb-4 size-full rounded-xl p-3 shadow-sm outline outline-gray4 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0"
      onClick={() =>
        navigator.clipboard
          .writeText(props.contents ?? '')
          .then(() => toast.success('Copied to clipboard'))
          .catch(() => toast.error('Failed to copy to clipboard'))
      }
    >
      {/* @ts-ignore because it's a web component */}
      <qr-code key={props.contents} {...props} style={{ margin: '-15px' }}>
        <img src="/icons/ithaca-light.svg" alt="icon" slot="icon" />
        {/* @ts-ignore because it's a web component. This extra ts-ignore is on purpose. */}
      </qr-code>
    </button>
  )
}
