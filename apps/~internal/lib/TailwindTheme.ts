import { tailwindThemeMappings } from '../_generated/theme-mappings'

export function themeJsonToTailwindVars(jsonString: string): string {
  const theme = JSON.parse(jsonString)
  const lines: string[] = []

  lines.push('@theme {')

  for (const [property, tailwindVar, type] of tailwindThemeMappings) {
    const value = theme[property]
    if (value === undefined || value === null) continue

    const varValue = formatValue(value, type === 'px')
    lines.push(`  ${tailwindVar}: ${varValue};`)
  }

  lines.push('}')

  return lines.join('\n')
}

function formatValue(value: unknown, isRadius = false): string {
  if (Array.isArray(value) && value.length === 2) {
    const [light, dark] = value
    return `light-dark(${formatSingleValue(light)}, ${formatSingleValue(dark)})`
  }

  if (isRadius && typeof value === 'number') {
    return `${value}px`
  }

  return formatSingleValue(value)
}

function formatSingleValue(value: unknown): string {
  if (typeof value === 'string' && value.startsWith('#')) {
    return value.toLowerCase()
  }
  if (typeof value === 'number') {
    return `${value}px`
  }
  return String(value)
}
