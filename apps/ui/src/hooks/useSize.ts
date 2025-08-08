import type { RefObject } from 'react'
import { useEffect } from 'react'
import { debounce } from '../utils.js'

type Size = {
  height: number
  width: number
}

export function useSize<R extends RefObject<HTMLElement | null>>(
  ref: R,
  callback: (size: Size) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(
      debounce(([entry]) => {
        if (!entry || !entry.contentBoxSize[0])
          throw new Error('ResizeObserver entry is undefined')
        callback({
          height: entry.contentBoxSize[0].blockSize,
          width: entry.contentBoxSize[0].inlineSize,
        })
      }, 100),
    )

    const rect = ref.current.getBoundingClientRect()
    callback({ height: rect.height, width: rect.width })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [...deps, callback, ref.current])
}
