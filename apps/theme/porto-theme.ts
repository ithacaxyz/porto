import type { LightDarkColor, Theme } from 'porto/theme'

type FullTheme = Theme<'light dark'>

export type PortoTheme = Pick<FullTheme, 'colorScheme'> & {
  [K in keyof Omit<
    FullTheme,
    'colorScheme'
  > as K]: FullTheme[K] extends LightDarkColor
    ? [description: string, light: LightDarkColor[0], dark: LightDarkColor[1]]
    : FullTheme[K] extends number
      ? [description: string, radius: number]
      : never
}

// biome-ignore assist/source/useSortedKeys: keeping theme values grouped logically makes it easier to iterate on the theme
export const portoTheme: PortoTheme = {
  colorScheme: 'light dark',

  // general
  accent: [
    'Accent color. Used for highlighting text, icons or outline elements.',
    '#0588f0',
    '#3b9eff',
  ],
  focus: [
    'Focus ring color. Used for keyboard navigation and input fields.',
    '#0090ff',
    '#0090ff',
  ],
  link: [
    'Link color. Used for hyperlinks and interactive text elements.',
    '#0588f0',
    '#3b9eff',
  ],
  separator: [
    'Separator color. Used for dividing elements, such as lines between sections or items.',
    '#cecece',
    '#484848',
  ],

  // base surface
  baseBackground: [
    'Base background color. Used for the main dialog background and other large areas.',
    '#fcfcfc',
    '#191919',
  ],
  baseBorder: [
    'Base border color. Used around base surfaces.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  baseContent: [
    'Base content color. Used over baseBackground for text and icons.',
    '#202020',
    '#eeeeee',
  ],
  baseContentSecondary: [
    'Secondary base content color. Used over baseBackground for secondary text and icons.',
    '#8d8d8d',
    '#6e6e6e',
  ],
  baseContentTertiary: [
    'Tertiary base content color. Used over baseBackground for text and icons.',
    '#838383',
    '#7b7b7b',
  ],
  baseContentPositive: [
    'Positive base content color, such as success messages or positive values. Used over baseBackground for text and icons.',
    '#30a46c',
    '#30a46c',
  ],
  baseContentNegative: [
    'Negative base content color, such as error messages or negative values. Used over baseBackground for text and icons.',
    '#e5484d',
    '#e5484d',
  ],
  baseHoveredBackground: [
    'Base background color when hovered, e.g. for links showing a background color when hovered.',
    '#f0f0f0',
    '#222222',
  ],

  // frame (i.e. dialog window)
  frameBackground: [
    'Frame background color. Used for the dialog title bar and other frame elements.',
    '#fcfcfc',
    '#222222',
  ],
  frameContent: [
    'Frame content color. Used over frameBackground for text and icons.',
    '#838383',
    '#7b7b7b',
  ],
  frameBorder: [
    'Frame border color. Used around frame surfaces.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  frameRadius: ['Frame radius. Used for the radius of the dialog.', 14],

  // badges
  badgeBackground: [
    'Default badge background color. Used for small labels, indicators or icons, e.g. for the environment name in the title bar.',
    '#e8e8e8',
    '#2a2a2a',
  ],
  badgeContent: [
    'Badge content color. Used over badgeBackground for text and icons.',
    '#838383',
    '#7b7b7b',
  ],
  badgeStrongBackground: [
    'More prominent badge background color. Used for badges that need to stand out more than the default badge, such as the default icon in the title bar.',
    '#D9D9D9',
    '#3A3A3A',
  ],
  badgeStrongContent: [
    'Content color for strong badges. Used over badgeStrongBackground for text and icons.',
    '#000000',
    '#FFFFFF',
  ],
  badgeInfoBackground: [
    'Background color for info badges. Used for the background of icons that provide additional information or context, e.g. the icons used for screen titles.',
    '#008ff519',
    '#0077ff3a',
  ],
  badgeInfoContent: [
    'Content color for info badges. Used over badgeInfoBackground for text and icons.',
    '#0588f0',
    '#3b9eff',
  ],
  badgeNegativeBackground: [
    'Background color for negative badges. Used for badges indicating negative states or values, such as errors or warnings.',
    '#FCD8DA',
    '#500F1C',
  ],
  badgeNegativeContent: [
    'Content color for negative badges. Used over badgeNegativeBackground for text and icons.',
    '#DC3E42',
    '#EC5D5E',
  ],
  badgePositiveBackground: [
    'Background color for positive badges. Used for badges indicating positive states or values.',
    '#E3F3E8',
    '#1A3428',
  ],
  badgePositiveContent: [
    'Content color for positive badges. Used over badgePositiveBackground for text and icons.',
    '#30A46C',
    '#30A46C',
  ],
  badgeWarningBackground: [
    'Background color for warning badges. Used for badges indicating warnings or important notices.',
    '#FBF8E6',
    '#252018',
  ],
  badgeWarningContent: [
    'Content color for warning badges. Used over badgeWarningBackground for text and icons.',
    '#E2A336',
    '#8F6424',
  ],

  // primary
  primaryBackground: [
    'Primary background color. Used for primary buttons and important interactive elements.',
    '#0090ff',
    '#0090ff',
  ],
  primaryBorder: [
    'Primary border color. Used around primary surfaces.',
    '#e0e0e0',
    '#2a2a2a',
  ],
  primaryContent: [
    'Primary content color. Used over primaryBackground for text and icons.',
    '#FFF',
    '#FFF',
  ],
  primaryHoveredBackground: [
    'Primary buttons background color when hovered.',
    '#058bf0',
    '#3b9eff',
  ],
  primaryHoveredBorder: [
    'Primary border color when hovered. Used around primary surfaces.',
    '#058bf0',
    '#3b9eff',
  ],

  // secondary
  secondaryBackground: [
    'Secondary background color. Used for secondary buttons and interactive elements.',
    '#f0f0f0',
    '#222222',
  ],
  secondaryBorder: [
    'Secondary border color. Used around secondary surfaces.',
    '#f0f0f0',
    '#222222',
  ],
  secondaryContent: [
    'Secondary content color. Used over secondaryBackground for text and icons.',
    '#202020',
    '#eeeeee',
  ],
  secondaryHoveredBackground: [
    'Secondary buttons background color when hovered.',
    '#e8e8e8',
    '#2a2a2a',
  ],
  secondaryHoveredBorder: [
    'Secondary buttons border color when hovered. Used around secondary surfaces.',
    '#e8e8e8',
    '#2a2a2a',
  ],

  // disabled
  disabledBackground: [
    'Disabled buttons background color. Used for disabled buttons and interactive elements.',
    '#F0F0F0',
    '#222222',
  ],
  disabledBorder: [
    'Disabled buttons border color. Used for borders around disabled surfaces.',
    '#F0F0F0',
    '#222222',
  ],
  disabledContent: [
    'Disabled content color. Used over disabledBackground for text and icons.',
    '#BBBBBB',
    '#606060',
  ],

  // positive / negative
  negativeBackground: [
    'Negative background color. Generally red, used for elements indicating error or negative state, such as a destructive action or an error message.',
    '#feebec',
    '#3b1219',
  ],
  negativeContent: [
    'Negative content color. Used over negativeBackground for text and icons in error elements.',
    '#e5484d',
    '#e5484d',
  ],
  positiveBackground: [
    'Positive background color. Generally green, used for elements indicating success or positive state, such as a success message or a confirmation button.',
    '#e6f7ed',
    '#0d2a1f',
  ],
  positiveContent: [
    'Positive content color. Used over positiveBackground for text and icons in success elements.',
    '#30a46c',
    '#30a46c',
  ],

  // field
  fieldBackground: [
    'Field background color. Used for input fields, text areas, some edit buttons, and other form elements.',
    '#e8e8e8',
    '#222222',
  ],
  fieldBorder: [
    'Field border color. Used around field surfaces.',
    '#e0e0e0',
    '#313131',
  ],
  fieldContent: [
    'Field content color. Used over fieldBackground for text and icons.',
    '#646464',
    '#b4b4b4',
  ],
  fieldContentSecondary: [
    'Field secondary content color. Used over fieldBackground for text and icons.',
    '#838383',
    '#7b7b7b',
  ],
  fieldErrorBorder: [
    'Field error border color. Used around field surfaces.',
    '#eb8e90',
    '#b54548',
  ],
  fieldFocusedBackground: [
    'Field background color when focused. Used for input fields and other form elements when they are focused or active.',
    '#e0e0e0',
    '#313131',
  ],
  fieldFocusedContent: [
    'Field content color when focused. Used over fieldFocusedBackground for text and icons in focused input fields.',
    '#202020',
    '#eeeeee',
  ],
}
