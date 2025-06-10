import themePreviewDark from './theme-preview-dark.png'
import themePreviewLight from './theme-preview-light.png'
import themePreviewPink from './theme-preview-pink.png'

export const radiuses = ['xs', 's', 'm', 'l'] as const
export const animations = ['none', 'essential', 'all'] as const

export type Color = `#${string}`

export type ThemeRadius = typeof radiuses[number]
export type ThemeAnimations = typeof animations[number]

// layers: surfaces on which content is placed
// indicators: elements that indicate state
export type Theme = {
  // biome-ignore format: themes are organized by layer

  id: string
  parent: string | null
  name: string
  previewUrl: string
  radius: ThemeRadius
  animations: ThemeAnimations

  indicatorShape: 'circle' | 'square'

  layerBackground: Color

  layerBase: Color
  layerBaseContent: Color
  layerBaseMuted: Color

  layerRaised: Color
  layerRaisedContent: Color

  indicator: Color
  indicatorContent: Color

  radiusSmall: number
  radiusMedium: number
  radiusLarge: number

  separatorColor: Color
  separatorWidth: number

  borderColor: Color
  borderWidth: number

  shadowColor: Color
}

// default color for now
const c = '#FFFFFF'

export const baseThemes = [
  // biome-ignore format: themes are organized by layer
  {
    id: 'light',
    parent: null,
    name: 'Light',
    previewUrl: themePreviewLight,
    radius: 'm',
    animations: 'all',
    indicatorShape: 'circle',

    layerBackground: c,
    layerBase: c,
    layerBaseContent: c,
    layerBaseMuted: c,
    layerRaised: c,
    layerRaisedContent: c,
    indicator: c,
    indicatorContent: c,
    radiusSmall: 0,
    radiusMedium: 0,
    radiusLarge: 0,
    separatorColor: c,
    separatorWidth: 1,
    borderColor: c,
    borderWidth: 1,
    shadowColor: c,
  },
  {
    id: 'dark',
    parent: 'light',
    name: 'Dark',
    previewUrl: themePreviewDark,
    radius: 'm',
    animations: 'all',
    indicatorShape: 'square',

    layerBackground: c,
    layerBase: c,
    layerBaseContent: c,
    layerBaseMuted: c,
    layerRaised: c,
    layerRaisedContent: c,
    indicator: c,
    indicatorContent: c,
    radiusSmall: 0,
    radiusMedium: 0,
    radiusLarge: 0,
    separatorColor: c,
    separatorWidth: 1,
    borderColor: c,
    borderWidth: 1,
    shadowColor: c,
  },
  {
    id: 'pink',
    parent: 'light',
    name: 'Pink',
    previewUrl: themePreviewPink,
    radius: 'm',
    animations: 'all',
    indicatorShape: 'circle',

    layerBackground: c,
    layerBase: c,
    layerBaseContent: c,
    layerBaseMuted: c,
    layerRaised: c,
    layerRaisedContent: c,
    indicator: c,
    indicatorContent: c,
    radiusSmall: 0,
    radiusMedium: 0,
    radiusLarge: 0,
    separatorColor: c,
    separatorWidth: 1,
    borderColor: c,
    borderWidth: 1,
    shadowColor: c,
  },
] as const satisfies readonly Theme[]
