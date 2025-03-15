import { defineCustomElements } from '@bitjson/qr-code'
import * as React from 'react'
import { toast } from 'sonner'

import { cx } from 'cva'

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
      className={cx(
        'text-white',
        'mb-12 size-full rounded-xl shadow-sm',
        'hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0',
      )}
      onClick={() =>
        navigator.clipboard
          .writeText(props.contents ?? '')
          .then(() => toast.success('Copied to clipboard'))
          .catch(() => toast.error('Failed to copy to clipboard'))
      }
    >
      {/* @ts-ignore because it's a web component */}
      <qr-code
        key={props.contents}
        {...props}
        module-color="#F7F7F7"
        position-ring-color="#F7F7F7"
        position-center-color="#F7F7F7"
        style={{
          margin: '-10px',
        }}
      >
        <img src={'/icons/exp.svg'} alt="icon" slot="icon" />
        {/* @ts-ignore because it's a web component. This extra ts-ignore is on purpose. */}
      </qr-code>
    </button>
  )
}
