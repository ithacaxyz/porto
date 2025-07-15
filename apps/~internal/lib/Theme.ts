import { isColor, isLightDarkColor } from '../../theme/Theme'
import { tailwindThemeMappings } from '../_generated/theme-mappings'

export function jsonToTailwind(jsonString: string): string {
  const theme = JSON.parse(jsonString)

  const lines: string[] = ['@theme {']

  for (const [property, tailwindVar, type] of tailwindThemeMappings) {
    const value = theme[property]
    if (value === undefined || value === null) continue

    const varValue = formatValue(value, type)
    lines.push(`  ${tailwindVar}: ${varValue};`)
  }

  lines.push('}')

  return lines.join('\n')
}

function formatValue(value: unknown, type: 'color' | 'px'): string {
  if (type === 'color' && isLightDarkColor(value))
    return `light-dark(
      ${formatValue(value[0], 'color')},
      ${formatValue(value[1], 'color')}
    )`
  if (type === 'color' && isColor(value)) return value.toLowerCase()
  if (type === 'px' && typeof value === 'number') return `${value}px`
  return String(value)
}
