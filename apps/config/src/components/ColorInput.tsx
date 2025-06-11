import * as stylex from '@stylexjs/stylex'
import { colord } from 'colord'
import { useRef, useState } from 'react'

type HexColor = `#${string}`
const PLACEHOLDER_COLOR = '#F0F0F0'

const styles = stylex.create({
  colorInput: {
    '::-moz-color-swatch': {
      appearance: 'none',
      border: 0,
    },
    '::-webkit-color-swatch': {
      appearance: 'none',
      border: 0,
      borderRadius: '50%',
      height: 22,
      margin: 0,
      width: 22,
    },
    ':active': {
      transform: 'translateY(1px)',
    },
    ':focus-visible': {
      outline: '2px solid #0090FF',
      outlineOffset: '-2px',
    },
    background: 'none',
    border: '1px solid #E8E8E8',
    borderRadius: '50%',
    cursor: 'pointer',
    flexShrink: 0,
    height: 22,
    padding: 0,
    width: 22,
  },
  main: {
    alignItems: 'center',
    border: '1px solid #E8E8E8',
    borderRadius: 20,
    color: '#202020',
    display: 'flex',
    height: 40,
    justifyContent: 'space-between',
    padding: '0 12px',
    width: 160,
  },
  mainFocused: {
    outline: '2px solid #0090FF',
    outlineOffset: '-1px',
  },
  valueInput: {
    background: 'transparent',
    border: 0,
    height: '100%',
    outline: 0,
    padding: 0,
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
    <div {...stylex.props(styles.main, focused && styles.mainFocused)}>
      <input
        onBlur={() => {
          const finalColor =
            prepareHexColor(valueInput) ?? lastValidValue.current
          onChange(finalColor)
          setValueInput(finalColor ?? '')
          setFocused(false)
        }}
        onChange={(e) => {
          setValueInput(e.target.value)
          onChange(prepareHexColor(e.target.value))
        }}
        onFocus={(e) => {
          e.target.select()
          setFocused(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
        spellCheck={false}
        type="text"
        value={valueInput}
        {...stylex.props(styles.valueInput)}
      />
      <input
        onChange={() => {}}
        type="color"
        value={color ?? PLACEHOLDER_COLOR}
        {...stylex.props(styles.colorInput)}
        style={{
          backgroundColor: color ?? PLACEHOLDER_COLOR,
        }}
      />
    </div>
  )
}
