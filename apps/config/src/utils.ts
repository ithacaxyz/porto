import type { ThemeAnimations, ThemeRadius } from './theming.js'

export function radiusLabel(radius: ThemeRadius) {
  if (radius === 'xs') {
    return 'XS'
  }
  if (radius === 's') {
    return 'S'
  }
  if (radius === 'm') {
    return 'M'
  }
  if (radius === 'l') {
    return 'L'
  }
  throw new Error(`Unknown radius identifier: ${radius}`)
}

export function animationsLabel(animations: ThemeAnimations) {
  if (animations === 'none') {
    return 'None'
  }
  if (animations === 'essential') {
    return 'Essential'
  }
  if (animations === 'all') {
    return 'All'
  }
  throw new Error(`Unknown animations identifier: ${animations}`)
}

export function themeColorLabel() {}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
