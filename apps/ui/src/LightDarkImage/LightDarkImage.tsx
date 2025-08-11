import type { ImgHTMLAttributes } from 'react'
import { Frame } from '~/Frame/Frame.js'

export function LightDarkImage({
  alt = '',
  dark,
  light,
  ...imgProps
}: LightDarkImage.Props) {
  const frame = Frame.useFrame(true)
  const colorScheme = frame?.colorScheme ?? 'light dark'
  return colorScheme === 'light dark' ? (
    // if the theme supports both light & dark color schemes,
    // we can rely on `prefers-color-scheme` media queries
    // which depends on the browser's color scheme preference
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={dark} />
      <source media="(prefers-color-scheme: light)" srcSet={light} />
      <img {...imgProps} alt={alt} src={light} />
    </picture>
  ) : (
    // for single color scheme themes (either light or dark),
    // we ignore the browser's color scheme preference, since
    // it could be set to a given color scheme while the dialog
    // theme only supports the other one
    <img {...imgProps} alt={alt} src={colorScheme === 'light' ? light : dark} />
  )
}

export namespace LightDarkImage {
  export interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    dark: string
    light: string
  }
}
