export type ThemeColorScheme = 'light' | 'dark' | 'light dark'

export type Theme<
  ColorScheme extends ThemeColorScheme,
  SchemeColor = ColorScheme extends 'light dark' ? CombinedColor : Color,
> = {
  colorScheme: ColorScheme

  accent: SchemeColor
  focus: SchemeColor
  link: SchemeColor
  separator: SchemeColor

  baseBackground: SchemeColor
  baseBorder: SchemeColor
  baseContent: SchemeColor
  baseContentDimmed: SchemeColor
  baseHoveredBackground: SchemeColor

  frameBackground: SchemeColor
  frameBorder: SchemeColor
  frameContent: SchemeColor
  frameRadius: number

  iconInfoBackground: SchemeColor
  iconInfoContent: SchemeColor

  primaryBackground: SchemeColor
  primaryContent: SchemeColor
  primaryBorder: SchemeColor
  primaryHoveredBackground: SchemeColor
  primaryHoveredBorder: SchemeColor

  fieldBackground: SchemeColor
  fieldContent: SchemeColor
  fieldBorder: SchemeColor
  fieldErrorBorder: SchemeColor
  fieldFocusedBackground: SchemeColor
  fieldFocusedContent: SchemeColor

  positiveBackground: SchemeColor
  positiveContent: SchemeColor

  negativeBackground: SchemeColor
  negativeContent: SchemeColor
}

export type ThemeFragment =
  | PartialTheme<Theme<'light'>>
  | PartialTheme<Theme<'dark'>>
  | PartialTheme<Theme<'light dark'>>

type PartialTheme<Th extends Theme<ThemeColorScheme>> = Partial<
  Omit<Th, 'colorScheme'>
> & {
  colorScheme: Th['colorScheme']
}

export type Color = `#${string}` | 'transparent'
export function isColor(value: unknown): value is Color {
  return (
    typeof value === 'string' &&
    (value === 'transparent' ||
      /^#([0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value))
  )
}

export type CombinedColor = [light: Color, dark: Color]
export function isCombinedColor(value: unknown): value is CombinedColor {
  return Array.isArray(value) && value.length === 2 && value.every(isColor)
}
