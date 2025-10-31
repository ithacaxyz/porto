import * as z from 'zod/mini'
import * as u from '../core/internal/schema/utils.js'

export const ThemeColorScheme = z.union([
  z.literal('light'),
  z.literal('dark'),
  z.literal('light dark'),
])
export type ThemeColorScheme = z.infer<typeof ThemeColorScheme>

export const isThemeColorScheme = (value: unknown) =>
  u.is(ThemeColorScheme, value)

/**
 * Porto theme definition.
 */
export type Theme<
  ColorScheme extends ThemeColorScheme,
  SchemeColor = ColorScheme extends 'light dark' ? LightDarkColor : Color,
> = {
  colorScheme: ColorScheme

  accent: SchemeColor
  focus: SchemeColor
  link: SchemeColor
  separator: SchemeColor

  radiusSmall: number
  radiusMedium: number
  radiusLarge: number

  baseBackground: SchemeColor
  baseAltBackground: SchemeColor
  basePlaneBackground: SchemeColor
  baseBorder: SchemeColor
  baseContent: SchemeColor
  baseContentSecondary: SchemeColor
  baseContentTertiary: SchemeColor
  baseContentPositive: SchemeColor
  baseContentNegative: SchemeColor
  baseContentWarning: SchemeColor
  baseHoveredBackground: SchemeColor

  frameBackground: SchemeColor
  frameBorder: SchemeColor
  frameContent: SchemeColor
  frameRadius: number

  badgeBackground: SchemeColor
  badgeContent: SchemeColor
  badgeStrongBackground: SchemeColor
  badgeStrongContent: SchemeColor
  badgeInfoBackground: SchemeColor
  badgeInfoContent: SchemeColor
  badgeNegativeBackground: SchemeColor
  badgeNegativeContent: SchemeColor
  badgePositiveBackground: SchemeColor
  badgePositiveContent: SchemeColor
  badgeWarningBackground: SchemeColor
  badgeWarningContent: SchemeColor

  primaryBackground: SchemeColor
  primaryContent: SchemeColor
  primaryBorder: SchemeColor
  primaryHoveredBackground: SchemeColor
  primaryHoveredBorder: SchemeColor

  secondaryBackground: SchemeColor
  secondaryContent: SchemeColor
  secondaryBorder: SchemeColor
  secondaryHoveredBackground: SchemeColor
  secondaryHoveredBorder: SchemeColor

  distinctBackground: SchemeColor
  distinctContent: SchemeColor
  distinctBorder: SchemeColor

  disabledBackground: SchemeColor
  disabledBorder: SchemeColor
  disabledContent: SchemeColor

  negativeBackground: SchemeColor
  negativeContent: SchemeColor
  negativeBorder: SchemeColor

  negativeSecondaryBackground: SchemeColor
  negativeSecondaryContent: SchemeColor
  negativeSecondaryBorder: SchemeColor

  positiveBackground: SchemeColor
  positiveContent: SchemeColor
  positiveBorder: SchemeColor

  strongBackground: SchemeColor
  strongContent: SchemeColor
  strongBorder: SchemeColor

  warningBackground: SchemeColor
  warningContent: SchemeColor
  warningBorder: SchemeColor
  warningStrongBackground: SchemeColor
  warningStrongContent: SchemeColor
  warningStrongBorder: SchemeColor

  fieldBackground: SchemeColor
  fieldContent: SchemeColor
  fieldContentSecondary: SchemeColor
  fieldContentTertiary: SchemeColor
  fieldBorder: SchemeColor
  fieldErrorBorder: SchemeColor
  fieldNegativeBorder: SchemeColor
  fieldNegativeBackground: SchemeColor
  fieldPositiveBorder: SchemeColor
  fieldPositiveBackground: SchemeColor
  fieldFocusedBackground: SchemeColor
  fieldFocusedContent: SchemeColor

  /**
   * Hide the email input field in the account creation flow.
   * When true, the email input field is hidden and a hidden input with empty value is used instead.
   * This is useful for passkey-only authentication where email collection is not desired.
   *
   * When hidden, Porto will use a truncated wallet address as the account label
   * (e.g., "0x775da7…717e09" - first 8 characters + last 6 characters).
   *
   * @default false (shows the email input field with "Optional" label)
   */
  hideEmailInput?: boolean | undefined

  /**
   * Hide the bug report icon in the dialog frame header.
   * When true, the bug report icon is not displayed.
   *
   * @default false (shows the bug report icon)
   */
  hideBugReportIcon?: boolean | undefined

  /**
   * Hide the account switcher link in the signed-in view.
   * When true, the "Switch" link is not displayed.
   *
   * @default false (shows the "Switch" link)
   */
  hideAccountSwitcher?: boolean | undefined

  /**
   * Hide the sign-up link in the signed-in view.
   * When true, the "Sign up" link is not displayed.
   *
   * @default false (shows the "Sign up" link)
   */
  hideSignUpLink?: boolean | undefined

  /**
   * Hide the sign-in button in the "Get started" view.
   * When true, the "Sign in" button is not displayed.
   *
   * @default false (shows the "Sign in" button)
   */
  hideSignInButton?: boolean | undefined

  /**
   * Hide the create account button in the "Get started" view.
   * When true, the "Create account" button and "First time?" label are not displayed.
   *
   * @default false (shows the create account button)
   */
  hideCreateAccountButton?: boolean | undefined

  /**
   * Customizable text labels for the dialog interface.
   * Allows customization of button text, prompts, and example values.
   */
  labels?:
    | {
        /**
         * Text shown before the domain name in the sign-in prompt.
         * Displayed at the top of the dialog when signing in.
         *
         * @default "Use Porto to sign in to"
         */
        signInPrompt?: string | undefined
        /**
         * Text for the sign-in button.
         * Shown when the user has the option to sign in with an existing account.
         *
         * @default "Sign in with Porto"
         */
        signInButton?: string | undefined
        /**
         * Text for the sign-up button.
         * Shown in the account creation flow.
         *
         * @default "Sign up with Porto"
         */
        signUpButton?: string | undefined
        /**
         * Text for the create account button.
         * Shown when user is creating a new account and sign-in option is also available.
         *
         * @default "Create Porto account"
         */
        createAccount?: string | undefined
        /**
         * Text for the continue button.
         * Shown when only sign-in is available (no sign-up option).
         *
         * @default "Continue with Porto"
         */
        continueButton?: string | undefined
        /**
         * Dialog title shown in the frame header.
         * Currently not implemented in the UI.
         *
         * @default "Porto"
         */
        dialogTitle?: string | undefined
        /**
         * Example email/account ID shown in the email input placeholder.
         * Only used when `hideEmailInput` is false (email input is visible).
         *
         * @default "example@ithaca.xyz"
         */
        exampleEmail?: string | undefined
        /**
         * Email address for bug reports shown in the dialog frame header.
         * Only used when `hideBugReportIcon` is false (bug icon is visible).
         *
         * @default "support@ithaca.xyz"
         */
        bugReportEmail?: string | undefined
        /**
         * Text for the account switcher link.
         * Only used when `hideAccountSwitcher` is false (switcher link is visible).
         * Shown in the signed-in view to allow switching to a different account.
         *
         * @default "Switch"
         */
        switchAccount?: string | undefined
        /**
         * Text for the sign-up link.
         * Only used when `hideSignUpLink` is false (sign-up link is visible).
         * Shown in the signed-in view to allow creating a new account.
         *
         * @default "Sign up"
         */
        signUpLink?: string | undefined
      }
    | undefined
}

type PartialTheme<Th extends Theme<ThemeColorScheme>> = Partial<
  Omit<Th, 'colorScheme'>
> & {
  colorScheme: Th['colorScheme']
}

/**
 * A Porto theme fragment, used to extend themes with partial definitions.
 * `light dark` only accepts color pairs (`LightDarkColor`), while `light`
 * and `dark` only accept single colors (`Color`).
 */
export type ThemeFragment =
  | PartialTheme<Theme<'light'>>
  | PartialTheme<Theme<'dark'>>
  | PartialTheme<Theme<'light dark'>>

export const Color = z.union([
  z.literal('transparent'),
  z
    .string()
    .check(z.regex(/^#([0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)),
])

export const LightDarkColor = z.readonly(z.tuple([Color, Color]))

/**
 * A color to be used in themes.
 *
 * This schema allows:
 * - Hex color with 6 or 3 digits (RRGGBB or RGB).
 * - Hex color + alpha with 8 digits (RRGGBBAA).
 * - The string "transparent".
 */
export type Color = z.infer<typeof Color>
export const isColor = (value: unknown) => u.is(Color, value)

/**
 * A light + dark color pair to be used in themes.
 *
 * The order must be `[light, dark]`, where:
 *   - `light` is the color used in light mode.
 *   - `dark` is the color used in dark mode.
 */
export type LightDarkColor = z.infer<typeof LightDarkColor>
export const isLightDarkColor = (value: unknown) => u.is(LightDarkColor, value)
