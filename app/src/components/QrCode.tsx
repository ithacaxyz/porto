import { defineCustomElements } from '@bitjson/qr-code'
import * as React from 'react'

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
  React.useEffect(() => {
    defineCustomElements(window)
  }, [])

  return (
    // @ts-ignore because it's a web component
    <qr-code key={props.contents} {...props}>
      <img src="/icons/ithaca-light.svg" alt="icon" slot="icon" />
      {/* @ts-ignore because it's a web component. This extra ts-ignore is on purpose. */}
    </qr-code>
  )
}
