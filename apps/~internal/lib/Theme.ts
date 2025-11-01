import * as PortoTheme from 'porto/theme'
import {
  type TailwindThemeMapping,
  tailwindThemeMappings,
} from '../_generated/theme-mappings'

export type TailwindCustomTheme = {
  colorScheme: PortoTheme.ThemeColorScheme
  tailwindCss: string
  hideEmailInput?: boolean | undefined
  hideBugReportIcon?: boolean | undefined
  hideAccountSwitcher?: boolean | undefined
  hideSignUpLink?: boolean | undefined
  hideSignInButton?: boolean | undefined
  hideCreateAccountButton?: boolean | undefined
  labels?:
    | {
        signInPrompt?: string | undefined
        signInButton?: string | undefined
        signUpButton?: string | undefined
        createAccount?: string | undefined
        continueButton?: string | undefined
        dialogTitle?: string | undefined
        exampleEmail?: string | undefined
        bugReportEmail?: string | undefined
        switchAccount?: string | undefined
        signUpLink?: string | undefined
      }
    | undefined
}

/** Formats a JSON theme string into a Tailwind theme declaration.
 *
 * @param jsonTheme - A JSON string representing the theme.
 * @param mappings - Mappings of theme properties to Tailwind CSS variables.
 * @returns An object containing the color scheme and the resulting CSS declaration for Tailwind.
 */
export function parseJsonTheme(
  jsonTheme: string,
  mappings: TailwindThemeMapping[] = tailwindThemeMappings,
): TailwindCustomTheme {
  const theme: unknown = JSON.parse(jsonTheme)

  if (typeof theme !== 'object' || theme === null) {
    throw new Error('Invalid theme JSON: must be a non-null object')
  }

  if (
    !('colorScheme' in theme) ||
    !PortoTheme.isThemeColorScheme(theme.colorScheme)
  ) {
    throw new Error('Invalid theme JSON: missing or invalid colorScheme')
  }

  let css = ''
  for (const [name, tailwindVar, type] of mappings) {
    const value = (theme as Record<string, unknown>)[name]
    if (value !== undefined)
      css += `\n    ${tailwindVar}: ${formatCssValue(value, type, theme.colorScheme)};`
  }

  // Extract non-CSS theme properties
  const hideEmailInput = (theme as Record<string, unknown>).hideEmailInput
  const hideBugReportIcon = (theme as Record<string, unknown>).hideBugReportIcon
  const hideAccountSwitcher = (theme as Record<string, unknown>)
    .hideAccountSwitcher
  const hideSignUpLink = (theme as Record<string, unknown>).hideSignUpLink
  const hideSignInButton = (theme as Record<string, unknown>).hideSignInButton
  const hideCreateAccountButton = (theme as Record<string, unknown>)
    .hideCreateAccountButton
  const labels = (theme as Record<string, unknown>).labels

  return {
    colorScheme: theme.colorScheme,
    hideAccountSwitcher:
      typeof hideAccountSwitcher === 'boolean'
        ? hideAccountSwitcher
        : undefined,
    hideBugReportIcon:
      typeof hideBugReportIcon === 'boolean' ? hideBugReportIcon : undefined,
    hideCreateAccountButton:
      typeof hideCreateAccountButton === 'boolean'
        ? hideCreateAccountButton
        : undefined,
    hideEmailInput:
      typeof hideEmailInput === 'boolean' ? hideEmailInput : undefined,
    hideSignInButton:
      typeof hideSignInButton === 'boolean' ? hideSignInButton : undefined,
    hideSignUpLink:
      typeof hideSignUpLink === 'boolean' ? hideSignUpLink : undefined,
    labels:
      labels && typeof labels === 'object'
        ? (labels as TailwindCustomTheme['labels'])
        : undefined,
    tailwindCss: `@layer theme {\n  :root, :host {${css}\n  }\n}`,
  }
}

/** Formats a value according to its type, for use in CSS.
 *
 * @param value - The value to format.
 * @param type - The type of the value, either 'color' or 'px'.
 * @returns The formatted CSS value.
 */
export function formatCssValue(
  value: unknown,
  type: 'color' | 'px',
  colorScheme: PortoTheme.ThemeColorScheme,
): string {
  if (type === 'color' && PortoTheme.isLightDarkColor(value)) {
    if (colorScheme === 'light dark') return formatLightDarkColor(value)
    throw new Error(
      'LightDarkColor values are only supported for "light dark" color schemes.',
    )
  }
  if (type === 'color' && PortoTheme.isColor(value))
    // the color scheme needs to be forced in any case since we inherit
    // from the base theme with light-dark() values, so for consistency,
    // single colors are also light-dark()
    return formatLightDarkColor([value, value])
  if (type === 'px' && typeof value === 'number') return `${value}px`
  throw new Error(
    `Unsupported theme value type: ${typeof value} for type ${type}`,
  )
}

function formatLightDarkColor([
  light,
  dark,
]: PortoTheme.LightDarkColor): string {
  return `light-dark(${light.toLowerCase()}, ${dark.toLowerCase()})`
}
