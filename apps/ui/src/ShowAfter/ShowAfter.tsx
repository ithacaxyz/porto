import { a, useSpring } from '@react-spring/web'
import { Ui } from '../Ui/Ui.js'

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
    const ui = Ui.useUi(true)
    return useSpring({
      config: {
        friction: 80,
        mass: 2,
        tension: 2000,
      },
      delay,
      from: { opacity: 0, transform: 'scale(0.97)' },
      immediate: ui?.reducedMotion,
      to: { opacity: 1, transform: 'scale(1)' },
    })
  }
}
