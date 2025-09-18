import type { CSSProperties } from 'react'
import { css } from '~/../styled-system/css'

export function Spinner({
  baseColor = 'transparent',
  color,
  padding,
  size = 'medium',
  thickness,
}: Spinner.Props) {
  padding ??= 1
  color ??= 'currentColor'

  if (size === 'large') size = 32
  if (size === 'medium') size = 20
  if (size === 'small') size = 16

  thickness ??= size / 10

  const radius = size / 2 - padding - thickness / 2
  const circumference = 2 * radius * Math.PI

  return (
    <div
      className={css({
        position: 'relative',
      })}
      style={{
        height: size,
        width: size,
      }}
    >
      <svg
        className={css({
          inset: 0,
          position: 'absolute',
        })}
        fill="none"
        height={size}
        role="presentation"
        width={size}
      >
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={baseColor}
          strokeWidth={thickness}
        />
        <g
          className={css({
            animation: 'spin 700ms linear infinite',
            transformOrigin: '50% 50%',
          })}
        >
          <circle
            className={css({
              animation: 'arc-pulse 1500ms infinite ease-in-out',
            })}
            cx="50%"
            cy="50%"
            fill="none"
            r={radius}
            shapeRendering="geometricPrecision"
            stroke={color}
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth={thickness}
            style={
              {
                '--arc-offset-max': `${circumference * 0.3}`,
                '--arc-offset-min': `${circumference * 0.4}`,
              } as CSSProperties
            }
          />
        </g>
      </svg>
    </div>
  )
}

export namespace Spinner {
  export type Props = {
    baseColor?: string | undefined
    color?: string | undefined
    padding?: number | undefined
    size?: Size | undefined
    thickness?: number | undefined
  }

  export type Size = 'small' | 'medium' | 'large' | number
}
