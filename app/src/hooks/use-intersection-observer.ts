import * as React from 'react'

export function useIntersectionObserver<T extends HTMLElement>({
  onIntersect,
}: {
  onIntersect: (entry: IntersectionObserverEntry) => void
}) {
  const ref = React.useRef<T>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) onIntersect(entry)
    })

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [onIntersect])

  return { ref } as const
}
