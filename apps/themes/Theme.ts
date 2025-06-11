export type Color = `#${string}` | 'transparent'

export type ThemeAnimations = 'none' | 'essential' | 'all'

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
