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
    '#e0e0e0',
    '#484848',
  ],

  radiusSmall: ['Small radius. Used for small elements like icons.', 5],
  radiusMedium: [
    'Medium radius. Used for medium-sized elements like input fields or buttons.',
    8,
  ],
  radiusLarge: [
    'Large radius. Used for larger elements like dialog windows or panels.',
    14,
  ],

  // base surface
  baseBackground: [
    'Base background color. Used for the main dialog background and other large areas.',
    '#fcfcfc',
    '#191919',
  ],
  baseAltBackground: [
    'Alternative base background color. Used for surfaces such as panels or sections that need to be visually distinct from the main baseBackground.',
    '#f0f0f0',
    '#2a2a2a',
  ],
  basePlaneBackground: [
    'Base plane background color. Used as a surface underneath baseBackground or as an alternative to it.',
    '#f9f9f9',
    '#222222',
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
    '#838383',
    '#7b7b7b',
  ],
  baseContentTertiary: [
    'Tertiary base content color. Used over baseBackground for tertiary text and icons.',
    '#8d8d8d',
    '#6e6e6e',
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
  baseContentWarning: [
    'Warning base content color. Used over baseBackground for warning text and icons.',
    '#e2a336',
    '#f59e0b',
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
    '#191919',
  ],
  frameContent: [
    'Frame content color. Used over frameBackground for text and icons.',
    '#8d8d8d',
    '#6e6e6e',
  ],
  frameBorder: [
    'Frame border color. Used around frame surfaces.',
    '#f0f0f0',
    '#313131',
  ],
  frameRadius: ['Frame radius. Used for the radius of the dialog.', 14],

  // badges
  badgeBackground: [
    'Default badge background color. Used for small labels, indicators or icons, e.g. for the environment name in the title bar.',
    '#e0e0e0',
    '#222222',
  ],
  badgeContent: [
    'Badge content color. Used over badgeBackground for text and icons.',
    '#838383',
    '#7b7b7b',
  ],
  badgeStrongBackground: [
    'More prominent badge background color. Used for badges that need to stand out more than the default badge, such as the default icon in the title bar.',
    '#d9d9d9',
    '#3a3a3a',
  ],
  badgeStrongContent: [
    'Content color for strong badges. Used over badgeStrongBackground for text and icons.',
    '#000000',
    '#ffffff',
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
    '#fcd8da',
    '#500f1c',
  ],
  badgeNegativeContent: [
    'Content color for negative badges. Used over badgeNegativeBackground for text and icons.',
    '#dc3e42',
    '#ec5d5e',
  ],
  badgePositiveBackground: [
    'Background color for positive badges. Used for badges indicating positive states or values.',
    '#e3f3e8',
    '#1a3428',
  ],
  badgePositiveContent: [
    'Content color for positive badges. Used over badgePositiveBackground for text and icons.',
    '#30a46c',
    '#30a46c',
  ],
  badgeWarningBackground: [
    'Background color for warning badges. Used for badges indicating warnings or important notices.',
    '#fbf8e6',
    '#252018',
  ],
  badgeWarningContent: [
    'Content color for warning badges. Used over badgeWarningBackground for text and icons.',
    '#e2a336',
    '#8f6424',
  ],

  // primary
  primaryBackground: [
    'Primary background color. Used for primary buttons and important interactive elements.',
    '#0090ff',
    '#0090ff',
  ],
  primaryBorder: [
    'Primary border color. Used around primary surfaces.',
    '#0090ff',
    '#0090ff',
  ],
  primaryContent: [
    'Primary content color. Used over primaryBackground for text and icons.',
    '#ffffff',
    '#ffffff',
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
    '#e8e8e8',
    '#2a2a2a',
  ],
  secondaryBorder: [
    'Secondary border color. Used around secondary surfaces.',
    '#e8e8e8',
    '#2a2a2a',
  ],
  secondaryContent: [
    'Secondary content color. Used over secondaryBackground for text and icons.',
    '#202020',
    '#eeeeee',
  ],
  secondaryHoveredBackground: [
    'Secondary buttons background color when hovered.',
    '#e0e0e0',
    '#313131',
  ],
  secondaryHoveredBorder: [
    'Secondary buttons border color when hovered. Used around secondary surfaces.',
    '#e0e0e0',
    '#313131',
  ],

  // distinct
  distinctBackground: [
    'Distinct background color. Used for elements that need to stand out between primary and secondary prominence.',
    '#fcfcfc',
    '#111111',
  ],
  distinctBorder: [
    'Distinct border color. Used around distinct surfaces.',
    '#e8e8e8',
    '#313131',
  ],
  distinctContent: [
    'Distinct content color. Used over distinctBackground for text and icons.',
    '#000000',
    '#ffffff',
  ],

  // disabled
  disabledBackground: [
    'Disabled buttons background color. Used for disabled buttons and interactive elements.',
    '#f0f0f0',
    '#222222',
  ],
  disabledBorder: [
    'Disabled buttons border color. Used for borders around disabled surfaces.',
    '#f0f0f0',
    '#222222',
  ],
  disabledContent: [
    'Disabled content color. Used over disabledBackground for text and icons.',
    '#bbbbbb',
    '#606060',
  ],

  // negative
  negativeBackground: [
    'Negative background color. Generally red, used for interactive elements indicating a critical action, such as a delete button.',
    '#dc3e42',
    '#8f6424',
  ],
  negativeContent: [
    'Negative content color. Used over negativeBackground for text and icons.',
    '#ffffff',
    '#ffffff',
  ],
  negativeBorder: [
    'Negative border color. Used around negative surfaces.',
    '#dc3e42',
    '#8f6424',
  ],

  // negative secondary
  negativeSecondaryBackground: [
    'Secondary negative background color. Used for elements indicating a non-critical negative action, such as cancelling an operation.',
    '#fcd8da',
    '#500f1c',
  ],
  negativeSecondaryContent: [
    'Danger content color. Used over dangerBackground for text and icons in critical elements.',
    '#e5484d',
    '#e5484d',
  ],
  negativeSecondaryBorder: [
    'Secondary negative border color. Used around secondary negative surfaces.',
    '#fcd8da',
    '#500f1c',
  ],

  // positive
  positiveBackground: [
    'Positive background color. Generally green, used for elements indicating success or positive state, such as a success message or a confirmation button.',
    '#30a46c',
    '#30a46c',
  ],
  positiveContent: [
    'Positive content color. Used over positiveBackground for text and icons in success elements.',
    '#ffffff',
    '#ffffff',
  ],
  positiveBorder: [
    'Positive border color. Used around positive surfaces.',
    '#30a46c',
    '#30a46c',
  ],

  // strong
  strongBackground: [
    'Strong background color. Used for elements that need to stand out, similar to primary but with a more pronounced effect.',
    '#202020',
    '#eeeeee',
  ],
  strongContent: [
    'Strong content color. Used over strongBackground for text and icons.',
    '#ffffff',
    '#000000',
  ],
  strongBorder: [
    'Strong border color. Used around strong surfaces.',
    '#202020',
    '#eeeeee',
  ],

  // warning
  warningBackground: [
    'Warning background color. Generally yellow or orange, used for elements indicating caution or a warning state.',
    '#fefbe9',
    '#252018',
  ],
  warningContent: [
    'Warning content color. Used over warningBackground for text and icons in warning elements.',
    '#e2a336',
    '#8f6424',
  ],
  warningBorder: [
    'Warning border color. Used around warning surfaces.',
    '#e2a336',
    '#8f6424',
  ],

  // field
  fieldBackground: [
    'Field background color. Used for input fields, text areas, some edit buttons, and other form elements.',
    '#f9f9f9',
    '#191919',
  ],
  fieldBorder: [
    'Field border color. Used around field surfaces.',
    '#e0e0e0',
    '#313131',
  ],
  fieldContent: [
    'Field content color. Used over fieldBackground for text and icons.',
    '#202020',
    '#eeeeee',
  ],
  fieldContentSecondary: [
    'Field secondary content color. Used over fieldBackground for text and icons.',
    '#8d8d8d',
    '#6e6e6e',
  ],
  fieldContentTertiary: [
    'Field tertiary content color. Used for less important text, such as helper text or hints. Used over fieldBackground for text and icons.',
    '#bbbbbb',
    '#606060',
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
