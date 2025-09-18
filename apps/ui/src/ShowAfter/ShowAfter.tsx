import { useEffect, useState } from 'react'

export function ShowAfter({
  children,
  delay = 0,
  renderWhenHidden = true,
}: ShowAfter.Props) {
  const [show, setShow] = useState(delay === 0)

  useEffect(() => {
    if (delay === 0) {
      setShow(true)
      return
    }
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return !renderWhenHidden && !show ? null : (
    <div style={{ opacity: Number(show) }}>{children}</div>
  )
}

export namespace ShowAfter {
  export interface Props {
    children: React.ReactNode
    delay?: number
    renderWhenHidden?: boolean
  }
}
