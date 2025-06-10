// biome-ignore format: themes are organized by layer

import type { Theme } from './theming.js'

import { a, useTransition } from '@react-spring/web'
import * as stylex from '@stylexjs/stylex'
import { IconSettings } from './icons/IconSettings.js'
import { IconStar } from './icons/IconStar.js'

import uniswapAlt from './uniswap-alt.png'
import uniswap from './uniswap.png'

const themes = stylex.create({
  light: {
    '--layer-background': '#EDEDED',

    '--layer-base': '#FCFCFC',
    '--layer-base-content': '#202020',
    '--layer-base-muted': '#8D8D8D',

    '--layer-raised': '#FCFCFC',
    '--layer-raised-content': '#8D8D8D',

    '--indicator': '#E3F1FB',
    '--indicator-content': '#0588F0',

    '--radius-small': '5px',
    '--radius-medium': '5px',
    '--radius-large': '14px',

    '--separator-width': '1px',
    '--separator-color': '#D9D9D9',

    '--border-color': '#D9D9D9',
    '--border-width': '1px',

    '--shadow-color': 'rgba(0, 0, 0, 0.07)',
  },
  dark: {
    '--layer-background': '#313131',

    '--layer-base': '#111111',
    '--layer-base-content': '#EEEEEE',
    '--layer-base-muted': '#6E6E6E',

    '--layer-raised': '#111111',
    '--layer-raised-content': '#6E6E6E',

    '--indicator': '#0D2847',
    '--indicator-content': '#3B9EFF',

    '--radius-small': '0',
    '--radius-medium': '0',
    '--radius-large': '0',

    '--separator-width': '1px',
    '--separator-color': '#222222',

    '--border-color': '#222222',
    '--border-width': '1px',

    '--shadow-color': 'rgba(0, 0, 0, 0.2)',
  },
  pink: {
    '--layer-background': '#FCE3EF',

    '--layer-base': '#FCFCFC',
    '--layer-base-content': '#202020',
    '--layer-base-muted': '#8D8D8D',

    '--layer-raised': '#FF007A',
    '--layer-raised-content': '#FFFFFF',

    '--indicator': '#FCE3EF',
    '--indicator-content': '#FF007A',

    '--radius-small': '5px',
    '--radius-medium': '5px',
    '--radius-large': '20px',

    '--separator-width': '1px',
    '--separator-color': '#F0F0F0',

    '--border-color': 'transparent',
    '--border-width': '0',

    '--shadow-color': 'rgba(0, 0, 0, 0.2)',
  },
})

const styles = stylex.create({
  main: {
    display: 'grid',
    height: '100%',
    padding: '24px 0 24px 24px',
  },
  view: {
    position: 'relative',
    display: 'grid',
    width: '100%',
    height: '100%',
    placeItems: 'center',
    background: 'var(--layer-background)',
    transition: 'background 0.1s ease-in-out',
    borderRadius: 12,
    padding: 24,
  },
  widgetWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  widgetBase: {
    overflow: 'hidden',
    width: 282,
    height: 305,
    color: 'var(--layer-base-content)',
    background: 'var(--layer-base)',
    borderRadius: 'var(--radius-large)',
    border: 'var(--border-width) solid var(--border-color)',
    boxShadow: '0px 4px 44px var(--shadow-color)',
    userSelect: 'none',
  },
  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    height: 34,
    padding: '0 12px',
    fontSize: 13,
    color: 'var(--layer-raised-content)',
    background: 'var(--layer-raised)',
    borderBottom: 'var(--separator-width) solid var(--separator-color)',
  },
  widgetHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  widgetIconSmall: {
    overflow: 'hidden',
    width: 20,
    height: 20,
    borderRadius: 'var(--radius-small)',
  },
  widgetHeaderSettings: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetContent: {
    padding: 12,
    fontSize: 15,
  },
  widgetInfoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  widgetInfoIndicator: {
    display: 'grid',
    placeItems: 'center',
    width: 30,
    height: 30,
    background: 'var(--indicator)',
    color: 'var(--indicator-content)',
    borderRadius: 'var(--radius-medium)',
  },
})

export function Preview({
  theme,
}: {
  theme: Theme
}) {
  const transitions = useTransition(theme, {
    keys: (theme) => String(theme.parent),
    from: {
      opacity: 0,
      transform: 'scale3d(0.8, 0.8, 1)',
    },
    enter: {
      opacity: 1,
      transform: 'scale3d(1, 1, 1)',
    },
    leave: {
      immediate: true,
      opacity: 0,
    },
    config: {
      mass: 2,
      tension: 2000,
      friction: 120,
    },
  })
  return (
    <div
      {...stylex.props(
        styles.main,
        themes[theme.parent as keyof typeof themes] ?? themes.light,
      )}
    >
      <div {...stylex.props(styles.view)}>
        {transitions((astyles, theme) => (
          <div {...stylex.props(styles.widgetWrapper)}>
            <a.div style={astyles}>
              <WidgetSignIn theme={theme} />
            </a.div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WidgetSignIn({
  theme,
}: {
  theme: Theme
}) {
  return (
    <section {...stylex.props(styles.widgetBase)}>
      <header {...stylex.props(styles.widgetHeader)}>
        <div {...stylex.props(styles.widgetHeaderTitle)}>
          <img
            alt=''
            src={theme.parent === 'pink' ? uniswapAlt : uniswap}
            width={20}
            height={20}
            {...stylex.props(styles.widgetIconSmall)}
          />
          uniswap.org
        </div>
        <div {...stylex.props(styles.widgetHeaderSettings)}>
          <IconSettings />
        </div>
      </header>
      <div {...stylex.props(styles.widgetContent)}>
        <div {...stylex.props(styles.widgetInfoRow)}>
          <div {...stylex.props(styles.widgetInfoIndicator)}>
            <IconStar />
          </div>
          <div>Request</div>
        </div>
      </div>
    </section>
  )
}
