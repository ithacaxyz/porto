import type { LightDarkColor, Theme } from './Theme'

type LightDarkTheme = Theme<'light dark'>

export type PortoTheme = Pick<LightDarkTheme, 'colorScheme'> & {
  [K in keyof Omit<
    LightDarkTheme,
    'colorScheme'
  > as K]: LightDarkTheme[K] extends LightDarkColor
    ? [description: string, light: LightDarkColor[0], dark: LightDarkColor[1]]
    : LightDarkTheme[K] extends number
      ? [description: string, radius: number]
      : never
}

// Order used to name theme properties:
//
// 1. Surface name (e.g. base, primary, field)
// 2. (optional) Variant (e.g. fieldError)
// 3. (optional) Interaction state (e.g. baseHovered, fieldFocused)
// 4. Surface part (e.g. fieldBackground, fieldContent, fieldBorder, fieldRadius)
// 5. (optional) Surface part variant (e.g. baseContentDimmed)
//
// Examples:
// - baseBackground: base object => background color
// - baseContent: base object => text color
// - baseHoveredBackground: base object => hovered => background color
// - baseHoveredContent: base object => hovered => text color

// biome-ignore assist/source/useSortedKeys: keeping theme values grouped logically makes iteration easier
export const portoTheme: PortoTheme = {
  colorScheme: 'light dark',

  // misc
  accent: [
    'Accent color. Used for highlighting text, icons or outline elements.',
    '#0588f0',
    '#3b9eff',
  ],
  focus: [
    'Focus ring color. Used for keyboard navigation and input fields.',
    '#F0F',
    '#eee',
  ],
  link: [
    'Link color. Used for hyperlinks and interactive text elements.',
    '#0588f0',
    '#3b9eff',
  ],
  separator: [
    'Separator color. Used for dividing elements, such as lines between sections or items.',
    '#e0e0e0',
    '#2a2a2a',
  ],

  // base
  baseBackground: [
    'Base background color. Used for the main dialog background and other large areas.',
    '#fcfcfc',
    '#191919',
  ],
  baseBorder: [
    'Base border color. Used for borders around base surfaces.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  baseContent: [
    'Base content color. Used over baseBackground for text and icons.',
    '#202020',
    '#eeeeee',
  ],
  baseContentDimmed: [
    'Base content color when dimmed. Used for text and icons that are less prominent.',
    '#8d8d8d',
    '#6e6e6e',
  ],
  baseHoveredBackground: [
    'Base background color when hovered.',
    '#f0f0f0',
    '#222222',
  ],

  // frame
  frameBackground: [
    'Frame background color. Used for the dialog title bar and other frame elements.',
    '#f9f9f9',
    '#222222',
  ],
  frameContent: [
    'Frame content color. Used over frameBackground for text and icons in the dialog title bar.',
    '#838383',
    '#7b7b7b',
  ],
  frameBorder: [
    'Frame border color. Used for the dialog border.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  frameRadius: ['Frame radius. Used for the radius of the dialog.', 14],

  // icon info
  iconInfoBackground: [
    'Icon info background color. Used for the background of icons that provide additional information or context.',
    '#008ff519',
    '#0077ff3a',
  ],
  iconInfoContent: [
    'Icon info color. Used for the color of icons that provide additional information or context.',
    '#0588f0',
    '#3b9eff',
  ],

  // primary
  primaryBackground: [
    'Primary background color. Used for primary buttons and important interactive elements.',
    '#0090ff',
    '#0090ff',
  ],
  primaryBorder: [
    'Primary border color. Used for borders around primary surfaces.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  primaryContent: [
    'Primary content color. Used over primaryBackground for text and icons.',
    '#FFF',
    '#FFF',
  ],
  primaryHoveredBackground: [
    'Primary background color when hovered. Used for primary buttons and important interactive elements when hovered.',
    '#058bf0',
    '#3b9eff',
  ],
  primaryHoveredBorder: [
    'Primary border color when hovered. Used for borders around primary surfaces when hovered.',
    '#058bf0',
    '#3b9eff',
  ],

  // positive / negative
  negativeBackground: [
    'Negative background color. Generally red, used for elements indicating error or negative state, such as a destructive action or an error message.',
    '#F0F',
    '#F0F',
  ],
  negativeContent: [
    'Negative content color. Used over negativeBackground for text and icons in error elements.',
    '#F0F',
    '#F0F',
  ],
  positiveBackground: [
    'Positive background color. Generally green, used for elements indicating success or positive state, such as a success message or a confirmation button.',
    '#F0F',
    '#F0F',
  ],
  positiveContent: [
    'Positive content color. Used over positiveBackground for text and icons in success elements.',
    '#F0F',
    '#F0F',
  ],

  // field
  fieldBackground: [
    'Field background color. Used for input fields, text areas, some edit buttons, and other form elements.',
    '#F0F',
    '#F0F',
  ],
  fieldBorder: [
    'Field border color. Used for the border around field surfaces.',
    '#F0F',
    '#F0F',
  ],
  fieldContent: [
    'Field content color. Used over fieldBackground for text and icons in input fields.',
    '#F0F',
    '#F0F',
  ],
  fieldErrorBorder: [
    'Field error border color. Used for the border around field surfaces when there is an error, such as invalid input.',
    '#F0F',
    '#F0F',
  ],
  fieldFocusedBackground: [
    'Field background color when focused. Used for input fields and other form elements when they are focused or active.',
    '#F0F',
    '#F0F',
  ],
  fieldFocusedContent: [
    'Field content color when focused. Used over fieldFocusedBackground for text and icons in focused input fields.',
    '#F0F',
    '#F0F',
  ],
}
