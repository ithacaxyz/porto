import { a, useSpring } from '@react-spring/web'

export function ShowAfter({ children, delay = 0 }: ShowAfter.Props) {
  const show = ShowAfter.useShowAfter(delay)
  return <a.div style={show}>{children}</a.div>
}

export namespace ShowAfter {
  export interface Props {
    children: React.ReactNode
    delay?: number
  }

  export function useShowAfter(delay: number) {
    return useSpring({
      delay,
      from: { opacity: 0, transform: 'scale(0.97)' },
      to: { opacity: 1, transform: 'scale(1)' },
    })
  }
}
