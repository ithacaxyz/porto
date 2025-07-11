export type ThemeColorScheme = 'light' | 'dark' | 'light dark'

export type Theme<
  ColorScheme extends ThemeColorScheme,
  SchemeColor = ColorScheme extends 'light dark' ? CombinedColor : Color,
> = {
  colorScheme: ColorScheme

  focus: SchemeColor

  baseSurface: SchemeColor
  baseContent: SchemeColor

  primarySurface: SchemeColor
  primaryContent: SchemeColor

  fieldSurface: SchemeColor
  fieldContent: SchemeColor
  fieldBorder: SchemeColor
  fieldBorderError: SchemeColor
  fieldFocusedSurface: SchemeColor
  fieldFocusedContent: SchemeColor

  positiveSurface: SchemeColor
  positiveContent: SchemeColor

  negativeSurface: SchemeColor
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
      /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value))
  )
}

export type CombinedColor = [light: Color, dark: Color]
export function isCombinedColor(value: unknown): value is CombinedColor {
  return Array.isArray(value) && value.length === 2 && value.every(isColor)
}
