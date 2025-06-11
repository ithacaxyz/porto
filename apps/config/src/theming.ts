import themePreviewDark from './theme-preview-dark.png'
import themePreviewLight from './theme-preview-light.png'
import themePreviewPink from './theme-preview-pink.png'
// import { theme as themeLight } from './themes/dark/theme.stylex.js'
// import { theme as themeDark } from './themes/light/theme.stylex.js'
// import { theme as themePink } from './themes/pink/theme.stylex.js'

export const radiuses = ['xs', 's', 'm', 'l'] as const
export const animations = ['none', 'essential', 'all'] as const

export type Color = `#${string}` | 'transparent'

export type ThemeRadius = (typeof radiuses)[number]
export type ThemeAnimations = (typeof animations)[number]

// layers: surfaces on which content is placed
// indicators: elements that indicate state
// separator: lines that separate content inside the widget
// border: the outer border of the main widget
// shadow: the shadow of the main widget
export type Theme = {
  id: string
  parent: string | null
  name: string
  previewUrl: string
  radius: ThemeRadius // todo: remove
  animations: ThemeAnimations

  indicator: Color
  indicatorContent: Color
  indicatorShape: 'circle' | 'square'

  layerBackground: Color

  layerPrimary: Color
  layerPrimaryContent: Color

  layerSecondary: Color
  layerSecondaryContent: Color

  layerBase: Color
  layerBaseContent: Color
  layerBaseMuted: Color
  layerBaseFaint: Color

  layerRaised: Color
  layerRaisedContent: Color

  radiusSmall: number
  radiusMedium: number
  radiusLarge: number

  separatorColor: Color
  separatorWidth: number

  windowBorderColor: Color
  windowBorderWidth: number
  windowShadowColor: Color
}

// default color
const missingColor = '#FF00FF'

export const baseThemes = [
  {
    // light theme
    animations: 'all',
    id: 'light',
    indicator: missingColor,
    indicatorContent: missingColor,
    indicatorShape: 'circle',
    layerBackground: missingColor,
    layerBase: missingColor,
    layerBaseContent: missingColor,
    layerBaseFaint: missingColor,
    layerBaseMuted: missingColor,
    layerPrimary: missingColor,
    layerPrimaryContent: missingColor,
    layerRaised: missingColor,
    layerRaisedContent: missingColor,
    layerSecondary: missingColor,
    layerSecondaryContent: missingColor,
    name: 'Light',
    parent: null,
    previewUrl: themePreviewLight,
    radius: 'm',
    radiusLarge: 0,
    radiusMedium: 0,
    radiusSmall: 0,
    separatorColor: missingColor,
    separatorWidth: 1,
    windowBorderColor: missingColor,
    windowBorderWidth: 1,
    windowShadowColor: missingColor,
  },
  {
    // dark theme
    animations: 'all',
    id: 'dark',
    indicator: missingColor,
    indicatorContent: missingColor,
    indicatorShape: 'square',
    layerBackground: missingColor,
    layerBase: missingColor,
    layerBaseContent: missingColor,
    layerBaseFaint: missingColor,
    layerBaseMuted: missingColor,
    layerPrimary: missingColor,
    layerPrimaryContent: missingColor,
    layerRaised: missingColor,
    layerRaisedContent: missingColor,
    layerSecondary: missingColor,
    layerSecondaryContent: missingColor,
    name: 'Dark',
    parent: 'light',
    previewUrl: themePreviewDark,
    radius: 'm',
    radiusLarge: 0,
    radiusMedium: 0,
    radiusSmall: 0,
    separatorColor: missingColor,
    separatorWidth: 1,
    windowBorderColor: missingColor,
    windowBorderWidth: 1,
    windowShadowColor: missingColor,
  },
  {
    // pink theme
    animations: 'all',
    id: 'pink',
    indicator: missingColor,
    indicatorContent: missingColor,
    indicatorShape: 'circle',
    layerBackground: missingColor,
    layerBase: missingColor,
    layerBaseContent: missingColor,
    layerBaseFaint: missingColor,
    layerBaseMuted: missingColor,
    layerPrimary: missingColor,
    layerPrimaryContent: missingColor,
    layerRaised: missingColor,
    layerRaisedContent: missingColor,
    layerSecondary: missingColor,
    layerSecondaryContent: missingColor,
    name: 'Pink',
    parent: 'light',
    previewUrl: themePreviewPink,
    radius: 'm',
    radiusLarge: 0,
    radiusMedium: 0,
    radiusSmall: 0,
    separatorColor: missingColor,
    separatorWidth: 1,
    windowBorderColor: missingColor,
    windowBorderWidth: 1,
    windowShadowColor: missingColor,
  },
] as const satisfies readonly Theme[]
