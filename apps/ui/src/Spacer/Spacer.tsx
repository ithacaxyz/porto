import { css } from '../../styled-system/css'
import { Frame } from '../Frame/Frame.js'

export function Spacer({ orientation, ...props }: Spacer.Props) {
  return orientation === 'horizontal' ? (
    <SpacerHorizontal {...props} />
  ) : (
    <SpacerVertical {...props} />
  )
}

function SpacerHorizontal({ size }: Omit<Spacer.Props, 'orientation'>) {
  const { mode } = Frame.useFrame()
  return (
    <div
      className={css({
        display: 'flex',
        height: '100%',
      })}
      style={{
        width: typeof size === 'number' ? size : (size[mode] ?? 0),
      }}
    />
  )
}

function SpacerVertical({ size }: Omit<Spacer.Props, 'orientation'>) {
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

export namespace Spacer {
  export interface Props {
    size: number | Record<Frame.ModeName, number>
    orientation?: 'horizontal' | 'vertical'
  }

  export const H = SpacerHorizontal
  export const V = SpacerVertical
}
