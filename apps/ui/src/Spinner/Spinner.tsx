import { a, useSpring } from '@react-spring/web'
import { css } from '~/../styled-system/css'

const CIRCLES = [
  {
    diff: -60,
    progression: [
      [0, 0.2, 0.5, 1],
      [0, 0.5, 0.8, 1],
    ],
  },
  {
    diff: 60,
    progression: [
      [0, 1],
      [0, 1],
    ],
  },
] as const

export function Spinner({
  color,
  padding,
  size = 'medium',
  thickness,
}: Spinner.Props) {
  padding ??= 1
  color ??= 'var(--color-th_accent)'

  if (size === 'large') size = 32
  if (size === 'medium') size = 20
  if (size === 'small') size = 16

  thickness ??= size / 10

  const rotateAnim = useSpring({
    config: {
      friction: 200,
      mass: 3,
      precision: 0.1,
      tension: 300,
    },
    from: { progress: 0 },
    loop: true,
    to: { progress: 1 },
  })

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
        <g
          className={css({
            animation: 'spin 1s linear infinite',
            transformOrigin: '50% 50%',
          })}
        >
          {CIRCLES.map(({ diff, progression }, i) => (
            <a.circle
              className={css({
                transformOrigin: '50% 50%',
              })}
              cx="50%"
              cy="50%"
              // biome-ignore lint/suspicious/noArrayIndexKey: CIRCLES is static
              key={i}
              r={radius}
              shapeRendering="geometricPrecision"
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference / 2}
              strokeLinecap="round"
              strokeWidth={thickness}
              style={{
                transform: rotateAnim.progress
                  .to(...progression)
                  .to((v) => `rotate3d(0, 0, 1, ${diff + v * 360}deg)`),
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export namespace Spinner {
  export type Props = {
    color?: string | undefined
    padding?: number | undefined
    size?: Size | undefined
    thickness?: number | undefined
  }

  export type Size = 'small' | 'medium' | 'large' | number
}
