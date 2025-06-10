import * as stylex from '@stylexjs/stylex'

const styles = stylex.create({
  base: {
    ':focus-visible': {
      outline: '2px solid #0090FF',
      outlineOffset: '2px',
    },
    alignItems: 'center',
    background: 'transparent',
    border: '0',
    borderRadius: 40,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 14,
    height: 36,
    justifyContent: 'center',
    outline: 'none',
    padding: '0 14px',
    transform: {
      ':active': 'translateY(1px)',
      default: 'translateY(0)',
    },
    userSelect: 'none',
  },
  fill: {
    background: '#0090FF',
    border: '1px solid #0090FF',
    color: '#FFFFFF',
  },
  large: {
    borderRadius: 52,
    fontSize: 16,
    height: 40,
    padding: '0 12px',
  },
  outline: {
    ':focus-visible': {
      outline: '2px solid #0090FF',
      outlineOffset: '-1px',
    },
    background: 'transparent',
    border: '1px solid #BBBBBB',
    color: '#BBBBBB',
  },
  outlineSelected: {
    // background: '#0090FF',
    // color: '#FFFFFF',
    // border: '1px solid #0090FF',
    background: 'transparent',
    border: '1px solid #0090FF',
    color: '#0090FF',
  },
  press: {
    transform: 'translateY(0)',
  },
  squareRatio: {
    aspectRatio: '1',
    padding: 0,
  },
})

export function Button({
  label,
  onClick,
  onPress,
  ratio = 'variable',
  selected,
  size = 'medium',
  variant = 'fill',
}: {
  label: string
  onClick?: () => void
  onPress?: () => void
  ratio?: 'variable' | 'square'
  selected?: boolean
  size?: 'medium' | 'large'
  variant?: 'fill' | 'outline'
}) {
  return (
    <button
      onClick={() => {
        onClick?.()
        onPress?.()
      }}
      onMouseDown={() => {
        onPress?.()
      }}
      {...stylex.props(
        styles.base,
        size === 'large' && styles.large,
        ratio === 'square' && styles.squareRatio,
        variant === 'fill' && styles.fill,
        variant === 'outline' && styles.outline,
        selected && variant === 'outline' && styles.outlineSelected,
        onPress && styles.press,
      )}
    >
      {label}
    </button>
  )
}
