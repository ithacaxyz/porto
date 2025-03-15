import { useRouterState } from '@tanstack/react-router'
import * as React from 'react'

export function NavigationProgress() {
  const { isLoading } = useRouterState()
  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: >_>
  React.useEffect(() => {
    if (isLoading) {
      setProgress(0)
      setVisible(true)

      intervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 90))
      }, 300)
    }

    if (!isLoading && visible) {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }, 300)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div className="absolute top-0 z-[999] h-[2px] w-full">
      <div
        className="h-full bg-accent transition-[width] duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  )
}
