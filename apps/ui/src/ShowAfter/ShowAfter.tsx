import { a, useSpring } from '@react-spring/web'

export interface ShowAfterProps {
  children: React.ReactNode
  delay?: number
}

export function ShowAfter({ children, delay = 0 }: ShowAfterProps) {
  const show = useShowAfter(delay)
  return <a.div style={show}>{children}</a.div>
}

function useShowAfter(delay: number) {
  return useSpring({
    delay,
    from: { opacity: 0, transform: 'scale(0.97)' },
    to: { opacity: 1, transform: 'scale(1)' },
  })
}

ShowAfter.useShowAfter = useShowAfter
