import * as React from 'react'

export function useClickOutside(
  elementRefs: React.RefObject<HTMLElement | null>[],
  callback: (event: MouseEvent) => void,
): void {
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target
      if (
        !(target instanceof Node) ||
        elementRefs.every((elementRef) => !elementRef.current?.contains(target))
      ) {
        callbackRef.current?.(event)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => document.removeEventListener('click', handleClickOutside, true)
  }, [elementRefs])
}
