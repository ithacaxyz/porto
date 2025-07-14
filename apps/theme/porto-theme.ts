/* biome-ignore format: might change later, for now keeping theme values grouped logically makes it iterating easier */
import type { CombinedColor, Theme} from './Theme'

type CombinedTheme = Theme<'light dark'>

export type PortoTheme = Pick<CombinedTheme, 'colorScheme'> & {
  [K in keyof Omit<CombinedTheme, 'colorScheme'> as K]: [
    description: string,
    light: CombinedColor[0],
    dark: CombinedColor[1],
  ]
}

export const portoTheme: PortoTheme = {
  colorScheme: 'light dark',

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

  baseHoveredBackground: [
    'Base background color when hovered.',
    '#f0f0f0',
    '#222222',
  ],

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
} as const
