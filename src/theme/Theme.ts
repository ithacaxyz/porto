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

  fieldBackground: SchemeColor
  fieldContent: SchemeColor
  fieldContentSecondary: SchemeColor
  fieldContentTertiary: SchemeColor
  fieldBorder: SchemeColor
  fieldErrorBorder: SchemeColor
  fieldFocusedBackground: SchemeColor
  fieldFocusedContent: SchemeColor
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
