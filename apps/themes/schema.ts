import * as v from 'valibot'

const ColorRegex =
  /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$|^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{1})?$/

export const ColorSchema = v.pipe(
  v.union([v.pipe(v.string(), v.startsWith('#')), v.literal('transparent')]),
  v.transform((value) => {
    if (value === 'transparent') {
      return value
    }
    if (ColorRegex.test(value)) {
      return value as `#${string}`
    }
    throw new Error(`Invalid color value: ${value}`)
  }),
)

export const AnimationsSchema = v.union([
  v.literal('none'),
  v.literal('essential'),
  v.literal('all'),
])

export const ThemeSchema = v.object({
  animations: AnimationsSchema,
  id: v.string(),
  indicator: ColorSchema,
  indicatorContent: ColorSchema,
  indicatorShape: v.union([v.literal('circle'), v.literal('square')]),

  layerBackground: ColorSchema,
  layerBase: ColorSchema,
  layerBaseContent: ColorSchema,

  layerBaseFaint: ColorSchema,

  layerBaseMuted: ColorSchema,
  layerPrimary: ColorSchema,

  layerPrimaryContent: ColorSchema,
  layerRaised: ColorSchema,

  layerRaisedContent: ColorSchema,
  layerSecondary: ColorSchema,
  layerSecondaryContent: ColorSchema,
  name: v.string(),

  parent: v.nullable(v.string()),
  previewUrl: v.string(),

  radiusLarge: v.number(),
  radiusMedium: v.number(),
  radiusSmall: v.number(),

  separatorColor: ColorSchema,
  separatorWidth: v.number(),

  windowBorderColor: ColorSchema,
  windowBorderWidth: v.number(),
  windowShadowColor: ColorSchema,
})
