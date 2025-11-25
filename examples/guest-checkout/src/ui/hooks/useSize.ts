import type { RefObject } from 'react'
import { useEffect } from 'react'

type Size = {
  height: number
  width: number
}

const DEBOUNCE_DURATION = 50

export function useSize<R extends RefObject<HTMLElement | null>>(
  ref: R,
  callback: (size: Size, ref: R) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (!ref.current) return

    let lastSize: Size | null = null
    let updateTimer: ReturnType<typeof setTimeout>
    let lastExecutionTime = 0

    const update = (size: Size, debounce = false) => {
      if (
        lastSize &&
        lastSize.height === size.height &&
        lastSize.width === size.width
      )
        return

      clearTimeout(updateTimer)

      const now = Date.now()
      if (!debounce || now - lastExecutionTime >= DEBOUNCE_DURATION) {
        lastSize = size
        lastExecutionTime = now
        callback(size, ref)
        return
      }

      updateTimer = setTimeout(() => {
        lastSize = size
        lastExecutionTime = Date.now()
        callback(size, ref)
      }, DEBOUNCE_DURATION)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      update(entry.contentRect, true)
    })

    update(ref.current.getBoundingClientRect())
    observer.observe(ref.current)

    return () => {
      clearTimeout(updateTimer)
      observer.disconnect()
    }
  }, [ref, callback, ...deps])
}
