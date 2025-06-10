import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'

const styles = stylex.create({
  button: {
    '--dot-opacity': '0',
    '--dot-size': '0',
    alignItems: 'flex-start',
    background: 'transparent',
    border: '0',
    borderRadius: 8,
    color: '#7d7d7d',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: 14,
    gap: 8,
    outline: 0,
    padding: 0,
    transition: 'color 50ms ease-in-out',
  },
  buttonSelected: {
    '--dot-opacity': '1',
    '--dot-size': '1',
    color: '#000000',
  },
  img: {
    aspectRatio: '704 / 388',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 8,
    width: '100%',
  },
  imgParent: {
    borderRadius: 8,
    display: 'flex',
    width: '100%',
  },
  imgParentFocused: {
    outline: '2px solid #0090FF',
    outlineOffset: 0,
  },
  imgSelected: {
    outline: '1px solid #BBBBBB',
    outlineOffset: 0,
  },
  label: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
  },
  labelDot: {
    background: '#0090FF',
    borderRadius: '50%',
    height: 6,
    opacity: 'var(--dot-opacity)',
    transform: 'scale(var(--dot-size))',
    transition: 'transform 50ms ease-in-out, opacity 50ms ease-in-out',
    width: 6,
  },
  main: {
    borderRadius: 4,
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
})

type Item = {
  id: string
  label: string
  thumbnail: string
}

export function ThumbnailPicker({
  items,
  onChange,
  selected,
}: {
  items: readonly Item[]
  onChange: (id: Item['id']) => void
  selected: Item['id']
}) {
  return (
    <div {...stylex.props(styles.main)}>
      {items.map((item) => (
        <ThumbnailButton
          item={item}
          key={item.id}
          onSelect={() => onChange(item.id)}
          selected={item.id === selected}
        />
      ))}
    </div>
  )
}

function ThumbnailButton({
  item,
  onSelect,
  selected,
}: {
  item: Item
  onSelect: (id: Item['id']) => void
  selected: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <button
      onBlur={() => setFocused(false)}
      onClick={() => {
        onSelect(item.id)
      }}
      onFocus={() => setFocused(true)}
      onMouseDown={(e) => {
        e.preventDefault()
        onSelect(item.id)
      }}
      {...stylex.props(styles.button, selected && styles.buttonSelected)}
    >
      <div
        {...stylex.props(styles.imgParent, focused && styles.imgParentFocused)}
      >
        <div
          {...stylex.props(styles.img, selected && styles.imgSelected)}
          style={{
            backgroundImage: `url(${item.thumbnail})`,
          }}
        />
      </div>
      <div {...stylex.props(styles.label)}>
        <div>{item.label}</div>
        <div {...stylex.props(styles.labelDot)} />
      </div>
    </button>
  )
}
