import { a, useTransition } from '@react-spring/web'
import { createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import type { ForwardedRef } from 'react'
import { useImperativeHandle, useRef, useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import { portoTheme } from '../../../theme/porto-theme.js'

export const Route = createFileRoute('/Theme')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Theme">
      <div className="grid gap-8">
        {Object.entries(portoTheme)
          .filter(([name]) => name !== 'colorScheme')
          .map(([name, value]) => {
            if (value === 'light dark') throw new Error()
            const [description, ...colorPairOrNumber] = value
            if (typeof colorPairOrNumber[0] === 'number') return null

            const colorPair = colorPairOrNumber as [`#${string}`, `#${string}`]

            return (
              <div className="flex max-w-2xl flex-col gap-2" key={name}>
                <h2 className="text-lg text-th_base">{name}</h2>
                <div className="grid h-30 grid-cols-2 ">
                  <ColorButton color={colorPair[0]} mode="light" side="left" />
                  <ColorButton color={colorPair[1]} mode="dark" side="right" />
                </div>
                <div className="mb-2 text-sm text-th_base-secondary leading-[1.5]">
                  {description}
                </div>
              </div>
            )
          })}
      </div>
    </ComponentScreen>
  )
}

function ColorButton({
  color,
  mode,
  side,
}: {
  color: `#${string}`
  mode: 'light' | 'dark'
  side: 'left' | 'right'
}) {
  const copyRef = useRef<{ show: () => void }>(null)
  const [mountCopyIndicator, setMountCopyIndicator] = useState(false)
  const intensity = colorIntensity(color)
  return (
    <button
      className={cx(
        'relative flex cursor-pointer! flex-col items-end border border-th_frame p-6 outline-0 outline-th_focus outline-offset-1 focus-visible:z-1 focus-visible:outline-2 active:translate-y-[1px]',
        side === 'left'
          ? 'rounded-l-th_medium border-r-0'
          : 'rounded-r-th_medium border-l-0',
      )}
      key={mode}
      onClick={() => {
        navigator.clipboard.writeText(color)
        if (!copyRef.current) setMountCopyIndicator(true)
        copyRef.current?.show()
      }}
      style={{
        backgroundColor: color.slice(0, 7), // remove alpha if present
        color: intensity === 'high' ? '#000' : '#fff',
      }}
      type="button"
    >
      <div>{mode}</div>
      <div className="relative">
        <div className="absolute right-full flex h-full items-center">
          {mountCopyIndicator && <CopyIndicator ref={copyRef} />}
        </div>
        <div className="ml-2">{color}</div>
      </div>
    </button>
  )
}

function CopyIndicator({
  ref,
}: {
  ref?: ForwardedRef<{
    show: () => void
  }>
}) {
  const [show, setShow] = useState(true)

  const copyTransition = useCopyTransition(show, setShow)
  useImperativeHandle(ref, () => ({
    show: () => setShow(true),
  }))

  return copyTransition(
    (style, item) =>
      item && (
        <a.div className="flex items-center text-sm" style={style}>
          copied
        </a.div>
      ),
  )
}

function useCopyTransition(show: boolean, setShow: (show: boolean) => void) {
  return useTransition(show, {
    config: {
      friction: 120,
      mass: 1,
      tension: 4000,
    },
    enter: () => async (next) => {
      await next({ opacity: 1, transform: 'scale(1)' })
      setShow(false)
    },
    from: { opacity: 0, transform: 'scale(0)' },
    leave: () => async (next) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await next({ opacity: 0, transform: 'scale(1)' })
    },
  })
}

// thanks https://stackoverflow.com/a/3943023
function colorIntensity(hex: `#${string}`): 'high' | 'low' {
  if (!/^#[0-9A-Fa-f]{6,8}$/.test(hex))
    throw new Error(`Invalid hex color: ${hex}`)
  const [r, g, b] = [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
  const intensity = r * 0.299 + g * 0.587 + b * 0.114
  return intensity > 186 ? 'high' : 'low'
}
