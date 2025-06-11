import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

const styles = stylex.create({
  column: {
    minHeight: 'calc(100dvh - 48px)',
  },
  main: {
    display: 'grid',
    fontSize: 16,
    gap: 0,
    gridTemplateColumns: '1fr 360px',
    height: '100dvh',
    lineHeight: 1.2,
    padding: 0,
    width: '100%',
  },
})

export function AppLayout({
  primary,
  secondary,
}: {
  primary: ReactNode
  secondary: ReactNode
}) {
  return (
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.column)}>{primary}</div>
      <div {...stylex.props(styles.column)}>{secondary}</div>
    </main>
  )
}
