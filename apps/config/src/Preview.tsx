import { a, useTransition } from '@react-spring/web'
import * as stylex from '@stylexjs/stylex'
import { IconSettings } from './icons/IconSettings.js'
import { IconSignIn } from './icons/IconSignIn.js'
import { IconStart } from './icons/IconStart.js'
import { theme as themeDark } from './themes/dark/theme.stylex.js'
import { theme as themeLight } from './themes/light/theme.stylex.js'
import { theme as themePink } from './themes/pink/theme.stylex.js'
import type { Theme } from './theming.js'
import uniswap from './uniswap.png'
import uniswapAlt from './uniswap-alt.png'

const styles = stylex.create({
  main: {
    display: 'grid',
    height: '100%',
    padding: '24px 0 24px 24px',
  },
  view: {
    background: 'var(--layer-background)',
    borderRadius: 12,
    display: 'grid',
    height: '100%',
    padding: 24,
    placeItems: 'center',
    position: 'relative',
    transition: 'background 0.1s ease-in-out',
    width: '100%',
  },
  viewWidgetWrapper: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  widgetBase: {
    background: 'var(--layer-base)',
    borderRadius: 'var(--radius-large)',
    boxShadow: '0px 4px 44px var(--shadow-color)',
    color: 'var(--layer-base-content)',
    outline: 'var(--window-border-width) solid var(--window-border-color)',
    // height: 305,
    overflow: 'hidden',
    userSelect: 'none',
    width: 282,
  },
  widgetButton: {
    ':active': {
      transform: 'translateY(1px)',
    },
    alignItems: 'center',
    background: 'var(--layer-secondary)',
    border: '0',
    borderRadius: 'var(--radius-medium)',
    color: 'var(--layer-secondary-content)',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 15,
    fontWeight: 500,
    gap: 6,
    height: 36,
    justifyContent: 'center',
    padding: 0,
    width: '100%',
  },
  widgetButtonPrimary: {
    background: 'var(--layer-primary)',
    color: 'var(--layer-primary-content)',
  },
  widgetContent: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 15,
    gap: 10,
    lineHeight: 1.5,
    padding: 12,
  },
  widgetDynamicVars: (theme: Theme) => ({
    '--indicator-medium-radius':
      theme.indicatorShape === 'circle' ? '50%' : 'var(--radius-medium)',
  }),
  widgetHeader: {
    alignItems: 'center',
    background: 'var(--layer-raised)',
    borderBottom: 'var(--separator-width) solid var(--separator-color)',
    color: 'var(--layer-raised-content)',
    display: 'flex',
    fontSize: 13,
    gap: 8,
    height: 34,
    justifyContent: 'space-between',
    padding: '0 12px',
  },
  widgetHeaderSettings: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  widgetHeaderTitle: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
  },
  widgetIconSmall: {
    borderRadius: 'var(--radius-small)',
    height: 20,
    overflow: 'hidden',
    width: 20,
  },
  widgetInfoIndicator: {
    background: 'var(--indicator)',
    borderRadius: 'var(--indicator-medium-radius)',
    color: 'var(--indicator-content)',
    display: 'grid',
    height: 32,
    placeItems: 'center',
    width: 32,
  },
  widgetInput: {
    '::placeholder': {
      color: 'var(--layer-base-faint)',
      fontWeight: 500,
    },
    background: 'transparent',
    border: '1px solid var(--separator-color)',
    borderRadius: 'var(--radius-medium)',
    display: 'block',
    fontSize: 15,
    height: 38,
    padding: '0 16px',
    width: '100%',
  },
  widgetInputLabel: {
    alignItems: 'center',
    color: 'var(--layer-base-muted)',
    display: 'flex',
    fontSize: 12,
    inset: '0 16px 0 auto',
    pointerEvents: 'none',
    position: 'absolute',
  },
  widgetInputWrapper: {
    position: 'relative',
  },
  widgetLabel: {
    alignItems: 'center',
    color: 'var(--layer-base-muted)',
    display: 'flex',
    fontSize: 13,
    gap: 8,
    height: 20,
  },
  widgetLabelLine: {
    background: 'var(--separator-color)',
    flexGrow: 1,
    height: 1,
  },
  widgetScreenIntroTitle: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 18,
    fontWeight: 500,
    gap: 8,
    paddingBottom: 6,
  },
})

export function Preview({ theme }: { theme: Theme }) {
  const transitions = useTransition(theme, {
    config: {
      friction: 140,
      mass: 3,
      tension: 2000,
    },
    enter: {
      opacity: 1,
      transform: 'translateY(0) scale3d(1, 1, 1)',
    },
    from: {
      opacity: 0,
      transform: 'translateY(20px) scale3d(0.85, 0.85, 1)',
    },
    // immediate: true,
    keys: (theme) => String(theme.parent),
    leave: {
      immediate: true,
      opacity: 0,
    },
  })
  return (
    <div
      {...stylex.props(
        styles.main,
        theme.parent === 'dark'
          ? themeDark.vars
          : theme.parent === 'pink'
            ? themePink.vars
            : themeLight.vars,
      )}
    >
      <div {...stylex.props(styles.view)}>
        {transitions((astyles, theme) => (
          <div {...stylex.props(styles.viewWidgetWrapper)}>
            <a.div style={astyles}>
              <WidgetSignIn theme={theme} />
            </a.div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WidgetSignIn({ theme }: { theme: Theme }) {
  return (
    <section
      {...stylex.props(styles.widgetBase, styles.widgetDynamicVars(theme))}
    >
      <header {...stylex.props(styles.widgetHeader)}>
        <div {...stylex.props(styles.widgetHeaderTitle)}>
          <img
            alt=""
            height={20}
            src={theme.parent === 'pink' ? uniswapAlt : uniswap}
            width={20}
            {...stylex.props(styles.widgetIconSmall)}
          />
          uniswap.org
        </div>
        <div {...stylex.props(styles.widgetHeaderSettings)}>
          <IconSettings />
        </div>
      </header>
      <div {...stylex.props(styles.widgetContent)}>
        <div>
          <div {...stylex.props(styles.widgetScreenIntroTitle)}>
            <div {...stylex.props(styles.widgetInfoIndicator)}>
              <IconStart />
            </div>
            <div>Get started</div>
          </div>
          <div>
            Authenticate with your passkey wallet to start using{' '}
            <strong>uniswap.org</strong>.
          </div>
        </div>
        <button
          tabIndex={-1}
          type="button"
          {...stylex.props(styles.widgetButton, styles.widgetButtonPrimary)}
        >
          <IconSignIn />
          Sign in
        </button>
        <div {...stylex.props(styles.widgetLabel)}>
          <div>First time, or lost access?</div>
          <div {...stylex.props(styles.widgetLabelLine)} />
        </div>
        <div {...stylex.props(styles.widgetInputWrapper)}>
          <input
            placeholder="example@ithaca.xyz"
            tabIndex={-1}
            type="text"
            {...stylex.props(styles.widgetInput)}
            disabled
          />
          <div {...stylex.props(styles.widgetInputLabel)}>Optional</div>
        </div>
        <button
          tabIndex={-1}
          type="button"
          {...stylex.props(styles.widgetButton)}
        >
          Create account
        </button>
      </div>
    </section>
  )
}
