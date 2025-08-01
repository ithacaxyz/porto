import type { ThemeFragment } from 'porto/theme'
import { useChainId, useConnect, useDisconnect } from 'wagmi'
import * as WagmiConfig from '../../wagmi.config'
import { Button } from '../Button'
import { permissions } from '../constants'

export function Example() {
  return (
    <div className="flex items-center gap-2 max-[600px]:flex-col">
      {(Object.keys(themes) as Array<keyof typeof themes>).map((themeId) => (
        <SignInThemeButton key={themeId} themeId={themeId} />
      ))}
    </div>
  )
}

export function SignInThemeButton({
  themeId,
}: {
  themeId: keyof typeof themes
}) {
  const chainId = useChainId()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = connectors.find(
    (connector) => connector.id === 'xyz.ithaca.porto',
  )!
  const { theme, label } = themes[themeId]
  return (
    <Button
      onClick={() => {
        WagmiConfig.portoDialogThemeController.setTheme(theme)
        disconnect()
        connect({
          capabilities: {
            grantPermissions: permissions(chainId),
          },
          connector,
        })
      }}
      size="small"
      type="button"
      variant="accentTint"
    >
      {label} Theme
    </Button>
  )
}

const themes = {
  dark: {
    label: 'Dark',
    theme: { colorScheme: 'dark' },
  },
  light: {
    label: 'Light',
    theme: { colorScheme: 'light' },
  },
  pink: {
    label: 'Custom',
    theme: {
      badgeBackground: '#ffffff',
      badgeContent: '#ff007a',
      badgeInfoBackground: '#fce3ef',
      badgeInfoContent: '#ff007a',
      badgeStrongBackground: '#ffffff',
      badgeStrongContent: '#ff007a',
      baseBackground: '#fcfcfc',
      baseBorder: '#f0f0f0',
      baseContent: '#202020',
      baseContentSecondary: '#8d8d8d',
      baseHoveredBackground: '#f0f0f0',
      colorScheme: 'light',
      fieldBackground: '#f0f0f0',
      fieldBorder: '#f0f0f0',
      fieldContent: '#202020',
      fieldErrorBorder: '#f0f',
      fieldFocusedBackground: '#f0f0f0',
      fieldFocusedContent: '#202020',
      focus: '#ff007a',
      frameBackground: '#ff007a',
      frameBorder: 'transparent',
      frameContent: '#ffffff',
      frameRadius: 14,
      link: '#ff007a',
      negativeBackground: '#f0f',
      negativeContent: '#f0f',
      positiveBackground: '#f0f',
      positiveContent: '#f0f',
      primaryBackground: '#ff007a',
      primaryBorder: '#ff007a',
      primaryContent: '#ffffff',
      primaryHoveredBackground: '#ff2994',
      primaryHoveredBorder: '#ff2994',
      separator: '#f0f0f0',
    },
  },
} as const satisfies Record<
  string,
  {
    label: string
    theme: ThemeFragment
  }
>
