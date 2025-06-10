import * as stylex from '@stylexjs/stylex'

import chevronDown from './chevron-down.svg'

type DropdownItem = {
  id: string
  label: string
}

export const styles = stylex.create({
  chevronContainer: {
    display: 'flex',
    height: 8,
    width: 14,
  },
  main: {
    // appearance: 'base-select',
    ':focus-visible': {
      outline: '2px solid #0090FF',
      outlineOffset: '-1px',
    },
    alignItems: 'center',
    background: '#F9F9F9',
    border: '1px solid #E8E8E8',
    borderRadius: 20,
    boxSizing: 'border-box',
    color: '#202020',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 16,
    fontWeight: 'inherit',
    height: 40,
    justifyContent: 'space-between',
    padding: '0 12px',
    width: '100%',
  },
})

export function Dropdown<Id extends string>({
  items,
  // onSelect,
  selected,
}: {
  items: readonly DropdownItem[]
  onSelect: (id: Id) => void
  selected: Id
}) {
  const selectedItem = items.find((item) => item.id === selected)
  if (!selectedItem) {
    throw new Error(`Selected item with id "${selected}" not found in items.`)
  }
  return (
    <div {...stylex.props(styles.main)}>
      {selectedItem.label}
      <div {...stylex.props(styles.chevronContainer)}>
        <img alt="" height={8} src={chevronDown} width={14} />
      </div>
    </div>
  )
  // return (
  //   <select
  //     onChange={(e) => {
  //       const selectedId = e.target.value as Id
  //       onSelect?.(selectedId)
  //     }}
  //     {...stylex.props(styles.main)}
  //   >
  //     {items.map((item) => (
  //       <option key={item.id} value={item.id}>
  //         {item.label}
  //       </option>
  //     ))}
  //   </select>
  // )
}
