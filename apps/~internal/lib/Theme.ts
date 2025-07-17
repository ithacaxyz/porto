import * as PortoTheme from 'porto/theme'
import {
  type TailwindThemeMapping,
  tailwindThemeMappings,
} from '../_generated/theme-mappings'

/** Formats a JSON theme string into a Tailwind theme declaration.
 *
 * @param jsonTheme - A JSON string representing the theme.
 * @param mappings - Mappings of theme properties to Tailwind CSS variables.
 * @returns Tailwind theme variables, ready to be used in a CSS file.
 */
export function formatTailwindTheme(
  jsonTheme: string,
  mappings: TailwindThemeMapping[] = tailwindThemeMappings,
): string {
  const theme = JSON.parse(jsonTheme)

  let css = ''
  for (const [name, tailwindVar, type] of mappings)
    if (theme[name] !== undefined)
      css += `\n    ${tailwindVar}: ${formatCssValue(theme[name], type)};`

  return `@layer theme {\n  :root, :host {${css}\n}\n}`
}

/** Formats a value according to its type, for use in CSS.
 *
 * @param value - The value to format.
 * @param type - The type of the value, either 'color' or 'px'.
 * @returns The formatted CSS value.
 */
export function formatCssValue(value: unknown, type: 'color' | 'px'): string {
  if (type === 'color' && PortoTheme.isLightDarkColor(value))
    return `light-dark(
      ${formatCssValue(value[0], 'color')},
      ${formatCssValue(value[1], 'color')}
    )`
  if (type === 'color' && PortoTheme.isColor(value)) return value.toLowerCase()
  if (type === 'px' && typeof value === 'number') return `${value}px`
  throw new Error(
    `Unsupported theme value type: ${typeof value} for type ${type}`,
  )
}
