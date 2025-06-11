import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import type { TabItem } from './Tabs.js'
import { Tabs } from './Tabs.js'

const styles = stylex.create({
  buttonsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  buttonsRowItem: {
    flexShrink: 0,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    height: '100%',
    overflowY: 'scroll',
    padding: 24,
    width: 360,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionHeading: {
    fontSize: 14,
    userSelect: 'none',
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  subsection: {
    borderTop: '1px solid #E8E8E8',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingTop: 16,
  },
  subsectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  subsectionHeading: {
    color: '#202020',
    display: 'flex',
    fontSize: 16,
    userSelect: 'none',
  },
  tabsWrapper: {
    alignItems: 'center',
    display: 'flex',
    gap: 16,
    height: 32,
    justifyContent: 'space-between',
    marginLeft: -8,
    width: '100%',
  },
})

export function Panel({
  children,
  onTabsChange,
  secondaryAction,
  selectedTab,
  tabs,
}: {
  children?: ReactNode
  onTabsChange: (id: TabItem['id']) => void
  secondaryAction?: ReactNode
  selectedTab: TabItem['id']
  tabs: TabItem[]
}) {
  const tab = tabs.find((tab) => tab.id === selectedTab)
  if (!tab) {
    throw new Error(`Tab with id "${selectedTab}" not found`)
  }
  return (
    <div
      // we can still scroll by focusing an element inside the panel
      tabIndex={-1}
      {...stylex.props(styles.main)}
    >
      <div {...stylex.props(styles.tabsWrapper)}>
        <Tabs items={tabs} onSelect={onTabsChange} selected={selectedTab} />
        {secondaryAction}
      </div>
      <div id={tab.panelId} role="tabpanel" {...stylex.props(styles.sections)}>
        {children}
      </div>
    </div>
  )
}

export function PanelSection({
  heading,
  children,
}: {
  heading: ReactNode
  children?: ReactNode
}) {
  return (
    <section {...stylex.props(styles.section)}>
      <h1 {...stylex.props(styles.sectionHeading)}>{heading}</h1>
      <div {...stylex.props(styles.sectionContent)}>{children}</div>
    </section>
  )
}

export function PanelSubsection({
  heading,
  children,
}: {
  heading: ReactNode
  children?: ReactNode
}) {
  return (
    <div {...stylex.props(styles.subsection)}>
      <h2 {...stylex.props(styles.subsectionHeading)}>{heading}</h2>
      <div {...stylex.props(styles.subsectionContent)}>{children}</div>
    </div>
  )
}

export function PanelSectionButtonsRow({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.buttonsRow)}>{children}</div>
}
