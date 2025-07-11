/* biome-ignore format: might change later, for now keeping theme values grouped logically makes it iterating easier */
import type { Theme } from './Theme'

type AddDescriptions<T> = Omit<
  T & {
    [K in keyof T as `${string & K}Description`]: string
  },
  'colorSchemeDescription'
>

export const portoTheme: AddDescriptions<Theme<'light dark'>> = {
  colorScheme: 'light dark',

  focus: ['#F0F', '#F0F'],
  focusDescription:
    'Focus ring color, used for keyboard navigation and input fields.',

  baseSurface: ['#fcfcfc', '#F0F'],
  baseSurfaceDescription:
    'Base surface color, used for the main dialog background and other large areas.',

  baseContent: ['#202020', '#F0F'],
  baseContentDescription:
    'Base surface content color, used over baseSurface for text and icons.',

  primarySurface: ['#F0F', '#F0F'],
  primarySurfaceDescription:
    'Primary surface color, used for primary buttons and important interactive elements.',

  primaryContent: ['#F0F', '#F0F'],
  primaryContentDescription:
    'Primary content color, used over primarySurface for text and icons.',

  fieldSurface: ['#F0F', '#F0F'],
  fieldSurfaceDescription:
    'Field surface color, used for input fields, text areas, some edit buttons, and other form elements.',

  fieldContent: ['#F0F', '#F0F'],
  fieldContentDescription:
    'Field content color, used over fieldSurface for text and icons in input fields.',

  fieldBorder: ['#F0F', '#F0F'],
  fieldBorderDescription:
    'Field border color, used for the border around fieldSurface elements.',

  fieldBorderError: ['#F0F', '#F0F'],
  fieldBorderErrorDescription:
    'Field border error color, used for the borders of input fields and text areas when there is an error.',

  fieldFocusedSurface: ['#F0F', '#F0F'],
  fieldFocusedSurfaceDescription:
    'Field focused surface color, used for the background of input fields when they are focused.',

  fieldFocusedContent: ['#F0F', '#F0F'],
  fieldFocusedContentDescription:
    'Field focused content color, used for the text and icons in input fields when they are focused.',

  positiveSurface: ['#F0F', '#F0F'],
  positiveSurfaceDescription:
    'Positive surface color, generally green, used for elements indicating success or positive state, such as a confirmation button.',
  positiveContent: ['#F0F', '#F0F'],
  positiveContentDescription:
    'Positive content color, used over positiveSurface for text and icons in success elements.',

  negativeSurface: ['#F0F', '#F0F'],
  negativeSurfaceDescription:
    'Negative surface color, generally red, used for elements indicating error or negative state, such as a destructive button or an error message.',
  negativeContent: ['#F0F', '#F0F'],
  negativeContentDescription:
    'Negative content color, used over negativeSurface for text and icons in error elements.',
}
