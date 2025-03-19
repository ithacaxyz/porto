import { defineCustomElements } from '@bitjson/qr-code'
import { cx } from 'cva'
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
      className={cx(
        'bg-white text-black',
        'rounded-2xl shadow-sm outline outline-gray5',
        'hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0',
      )}
      onClick={() =>
        navigator.clipboard
          .writeText(props.contents ?? '')
          .then(() => toast.success('Copied to clipboard'))
          .catch(() => toast.error('Failed to copy to clipboard'))
      }
    >
      {/** @see https://qr.bitjson.com */}
      {/* @ts-ignore because it's a web component */}
      <qr-code
        key={props.contents}
        {...props}
        module-color="#000"
        position-ring-color="#000"
        position-center-color="#000"
        style={{
          width: '125px',
          height: '125px',
        }}
      >
        <img src={'/icons/exp.svg'} alt="icon" slot="icon" className="-mt-1" />
        {/* @ts-ignore because it's a web component. This extra ts-ignore is on purpose. */}
      </qr-code>
    </button>
  )
}
