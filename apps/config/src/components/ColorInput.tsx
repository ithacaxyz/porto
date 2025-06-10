import * as stylex from '@stylexjs/stylex'
import { colord } from 'colord'
import { useRef, useState } from 'react'

type HexColor = `#${string}`
const PLACEHOLDER_COLOR = '#F0F0F0'

const styles = stylex.create({
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 160,
    height: 40,
    padding: '0 12px',
    color: '#202020',
    border: '1px solid #E8E8E8',
    borderRadius: 20,
  },
  mainFocused: {
    outline: '2px solid #0090FF',
    outlineOffset: '-1px',
  },
  valueInput: {
    height: '100%',
    padding: 0,
    border: 0,
    outline: 0,
    background: 'transparent',
  },
  colorInput: {
    flexShrink: 0,
    width: 22,
    height: 22,
    padding: 0,
    border: '1px solid #E8E8E8',
    borderRadius: '50%',
    background: 'none',
    cursor: 'pointer',
    ':active': {
      transform: 'translateY(1px)',
    },
    ':focus-visible': {
      outline: '2px solid #0090FF',
      outlineOffset: '-2px',
    },
    '::-webkit-color-swatch': {
      appearance: 'none',
      width: 22,
      height: 22,
      margin: 0,
      border: 0,
      borderRadius: '50%',
    },
    '::-moz-color-swatch': {
      appearance: 'none',
      border: 0,
    },
  },
})

function prepareHexColor(value: string): HexColor | null {
  let value_ = value.trim()
  const len = value_.length
  if ((len === 3 || len === 6) && !value_.startsWith('#')) {
    value_ = `#${value_}`
  }
  const color = colord(value_)
  return color.isValid() ? (color.toHex().toUpperCase() as HexColor) : null
}

export function ColorInput({
  value: valueProp,
  onChange,
}: {
  value: string
  onChange: (value: HexColor | null) => void
}) {
  const [focused, setFocused] = useState(false)
  const [valueInput, setValueInput] = useState(valueProp)

  const color = prepareHexColor(valueProp)
  const lastValidValue = useRef<HexColor | null>(null)
  if (color) {
    lastValidValue.current = color
  }

  return (
    <div
      {...stylex.props(
        styles.main,
        focused && styles.mainFocused,
      )}
    >
      <input
        type='text'
        spellCheck={false}
        value={valueInput}
        onChange={(e) => {
          setValueInput(e.target.value)
          onChange(prepareHexColor(e.target.value))
        }}
        onFocus={(e) => {
          e.target.select()
          setFocused(true)
        }}
        onBlur={() => {
          const finalColor = prepareHexColor(valueInput) ?? lastValidValue.current
          onChange(finalColor)
          setValueInput(finalColor ?? '')
          setFocused(false)
        }}
        {...stylex.props(styles.valueInput)}
      />
      <input
        type='color'
        value={color ?? PLACEHOLDER_COLOR}
        onChange={() => {
        }}
        {...stylex.props(styles.colorInput)}
        style={{
          backgroundColor: color ?? PLACEHOLDER_COLOR,
        }}
      />
    </div>
  )
}
