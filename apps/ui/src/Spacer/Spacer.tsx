import { css } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export type SpacerProps = {
  size: number | Record<Frame.Mode, number>
}

export function Spacer({
  orientation,
  ...props
}: SpacerProps & {
  orientation?: 'horizontal' | 'vertical'
}) {
  return orientation === 'horizontal' ? (
    <SpacerHorizontal {...props} />
  ) : (
    <SpacerVertical {...props} />
  )
}

function SpacerHorizontal(_props: SpacerProps) {
  return null
}

function SpacerVertical({ size }: SpacerProps) {
  const { mode } = Frame.useFrame()
  return (
    <div
      className={css({
        display: 'flex',
        width: '100%',
      })}
      style={{
        height: typeof size === 'number' ? size : (size[mode] ?? 0),
      }}
    />
  )
}

Spacer.H = SpacerHorizontal
Spacer.V = SpacerVertical
