import { cx } from 'cva'
import * as React from 'react'

export function TruncatedAddress({
  address,
  className,
  start: defaultStart = 8,
  end: defaultEnd = 8,
  minStart = 4,
  minEnd = 4,
  ...restProps
}: {
  address: string
  className?: string
  start?: number
  end?: number
  minStart?: number
  minEnd?: number
} & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measuringRef = React.useRef<HTMLSpanElement>(null)
  const [dynamicTruncation, setDynamicTruncation] = React.useState<{
    start: number
    end: number
  }>({ end: defaultEnd, start: defaultStart })

  const measureTextWidth = React.useCallback((text: string): number => {
    if (!measuringRef.current) return 0
    measuringRef.current.textContent = text
    return measuringRef.current.getBoundingClientRect().width
  }, [])

  const calculateOptimalTruncation = React.useCallback(() => {
    if (!containerRef.current || !measuringRef.current) return

    const containerWidth = containerRef.current.getBoundingClientRect().width

    const ellipsisWidth = measureTextWidth('...')
    const gapWidth = 4
    const availableWidth = containerWidth - ellipsisWidth - gapWidth * 2

    if (availableWidth <= 0) {
      setDynamicTruncation({ end: minEnd, start: minStart })
      return
    }

    const charWidth = measureTextWidth('0')
    if (charWidth <= 0) {
      setDynamicTruncation({ end: defaultEnd, start: defaultStart })
      return
    }

    const maxChars = Math.floor(availableWidth / charWidth)

    if (maxChars >= address.length) {
      setDynamicTruncation({ end: 0, start: address.length })
      return
    }

    const availableChars = Math.max(maxChars - minStart - minEnd, 0)
    const extraChars = availableChars

    const extraStart = Math.floor(extraChars / 2)
    const extraEnd = extraChars - extraStart

    const optimalStart = Math.min(
      minStart + extraStart,
      address.length - minEnd,
    )
    const optimalEnd = Math.min(
      minEnd + extraEnd,
      address.length - optimalStart,
    )

    setDynamicTruncation({
      end: Math.max(optimalEnd, minEnd),
      start: Math.max(optimalStart, minStart),
    })
  }, [
    address.length,
    measureTextWidth,
    minStart,
    minEnd,
    defaultStart,
    defaultEnd,
  ])

  React.useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      calculateOptimalTruncation()
    })

    resizeObserver.observe(containerRef.current)

    calculateOptimalTruncation()

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateOptimalTruncation])

  React.useEffect(() => {
    calculateOptimalTruncation()
  }, [calculateOptimalTruncation])

  const { start, end } = dynamicTruncation

  if (start >= address.length || start + end >= address.length) {
    return (
      <div
        className={cx(
          className,
          'flex flex-row items-center justify-center font-medium font-mono text-sm tracking-[0.25px]',
        )}
        ref={containerRef}
        {...restProps}
      >
        <span className="text-gray12">{address}</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute font-mono text-sm tracking-[0.25px] opacity-0"
          ref={measuringRef}
        />
      </div>
    )
  }

  const left = address.slice(0, start)
  const right = address.slice(-end)

  if (!left || !right) return address

  return (
    <div
      className={cx(
        className,
        'flex flex-row items-center justify-center gap-x-0.5 font-medium font-mono text-sm tracking-[0.25px]',
      )}
      ref={containerRef}
      {...restProps}
    >
      <span className="text-gray12">{left}</span>
      <p className="mb-1 font-bold text-gray9">...</p>
      <span className="text-gray12">{right}</span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute font-mono text-sm tracking-[0.25px] opacity-0"
        ref={measuringRef}
      />
    </div>
  )
}
