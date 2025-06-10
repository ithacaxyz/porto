import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef } from 'react'

// The component follows the ARIA Authoring Practices Guide Tabs Pattern [1][2]:
// - Only the selected tab is focusable (not the container nor the other tabs).
// - Once focused, the left and right arrows can be used to navigate between tabs.
// - The focus is moved by the component when the selected tab changes.
//
// [1] https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
// [2] https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/

export type TabItem = {
  id: string
  label: string
  panelId: string
}

const styles = stylex.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    userSelect: 'none',
    width: '100%',
  },
  tab: {
    '--tab-bar-opacity': 0,
    '--tab-bar-scale': 0,
    color: '#CECECE',
    display: 'flex',
    marginTop: -8,
    padding: '8px 0',
    position: 'relative',
  },
  tabBar: {
    background: '#0090FF',
    borderRadius: 2,
    height: 2,
    inset: 'auto 0 2px',
    opacity: 'var(--tab-bar-opacity)',
    position: 'absolute',
    transform: 'scale(var(--tab-bar-scale), 1)',
    transition: 'transform 80ms ease-in-out, opacity 80ms ease-in-out',
    willChange: 'transform, opacity',
  },
  tabButton: {
    background: 'transparent',
    border: '0',
    borderRadius: 4,
    color: '#CECECE',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 19,
    outline: {
      ':focus-visible': '2px solid #0090FF',
      default: 'none',
    },
    padding: '0 8px',
  },
  tabSelected: {
    '--tab-bar-opacity': 1,
    '--tab-bar-scale': 1,
    color: '#000000',
  },
})

export function Tabs({
  items,
  selected,
  onSelect,
}: {
  items: TabItem[]
  selected: TabItem['id']
  onSelect: (tab: TabItem['id']) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const focused = useRef(false)

  // keyboard navigation
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!focused.current) {
        return
      }
      const selectedIndex = items.findIndex((item) => item.id === selected)
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onSelect(items[(selectedIndex + 1) % items.length].id)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onSelect(
          items[selectedIndex === 0 ? items.length - 1 : selectedIndex - 1].id,
        )
        return
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [items, onSelect, selected])

  // focus handling
  useEffect(() => {
    if (!focused.current) {
      return
    }
    const selectedButton = container.current?.querySelector(
      '[tabindex="0"]',
    ) as null | HTMLElement
    selectedButton?.focus()
  }, [])

  return (
    <div
      onBlur={() => (focused.current = false)}
      onFocus={() => (focused.current = true)}
      ref={container}
      role="tablist"
      {...stylex.props(styles.main)}
    >
      {items.map((tab) => (
        <Tab
          key={tab.id}
          onSelect={onSelect}
          selected={selected === tab.id}
          tab={tab}
        />
      ))}
    </div>
  )
}

export function Tab({
  tab,
  selected,
  onSelect,
}: {
  tab: TabItem
  selected: boolean
  onSelect: (tab: TabItem['id']) => void
}) {
  return (
    <button
      aria-controls={tab.panelId}
      aria-selected={selected}
      id={tab.id}
      onClick={() => onSelect(tab.id)}
      onMouseDown={() => onSelect(tab.id)}
      role="tab"
      tabIndex={selected ? 0 : -1}
      title={tab.label}
      {...stylex.props(styles.tabButton, selected && styles.tabSelected)}
    >
      <div {...stylex.props(styles.tab, selected && styles.tabSelected)}>
        {tab.label}
        <div {...stylex.props(styles.tabBar)} />
      </div>
    </button>
  )
}
