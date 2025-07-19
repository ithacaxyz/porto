import { describe, expect, test } from 'vitest'
import { formatCssValue, parseJsonTheme } from './Theme.js'

type Mapping = [themeName: string, varName: string, type: 'color' | 'px']

const testMappings: Mapping[] = [
  ['accent', '--color-th_accent', 'color'],
  ['baseBackground', '--background-color-th_base', 'color'],
  ['baseContent', '--text-color-th_base', 'color'],
  ['primaryBackground', '--background-color-th_primary', 'color'],
  ['primaryContent', '--text-color-th_primary', 'color'],
  ['frameRadius', '--radius-th_frame', 'px'],
  ['fieldBorder', '--border-color-th_field', 'color'],
]

describe('parseJsonTheme', () => {
  test('converts porto theme to tailwind css', () => {
    const theme = {
      accent: '#FF007A',
      baseBackground: '#FCFCFC',
      colorScheme: 'light',
      primaryBackground: '#0090ff',
    }
    const { colorScheme, tailwindCss } = parseJsonTheme(
      JSON.stringify(theme),
      testMappings,
    )
    expect(colorScheme).toBe('light')
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: light-dark(#ff007a, #ff007a);
          --background-color-th_base: light-dark(#fcfcfc, #fcfcfc);
          --background-color-th_primary: light-dark(#0090ff, #0090ff);
        }
      }"
    `)
  })

  test('throws on missing colorScheme', () => {
    const theme = { accent: '#FF007A' }
    expect(() =>
      parseJsonTheme(JSON.stringify(theme), testMappings),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Invalid theme JSON: missing or invalid colorScheme]',
    )
  })

  test('accepts single color values for the "light dark" color scheme', () => {
    const theme = {
      accent: '#FF007A',
      colorScheme: 'light dark',
    }
    const { tailwindCss } = parseJsonTheme(JSON.stringify(theme), testMappings)
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: light-dark(#ff007a, #ff007a);
        }
      }"
    `)
  })

  test('rejects LightDarkColor values for non "light dark" color schemes', () => {
    const theme = {
      accent: ['#FF007A', '#FF007A'],
      colorScheme: 'light',
    }
    expect(() =>
      parseJsonTheme(JSON.stringify(theme), testMappings),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: LightDarkColor values are only supported for "light dark" color schemes.]`,
    )
  })

  test('converts light-dark color values', () => {
    const theme = {
      baseBackground: ['#fcfcfc', '#191919'],
      baseContent: ['#202020', '#eeeeee'],
      colorScheme: 'light dark',
    }
    const { tailwindCss } = parseJsonTheme(JSON.stringify(theme), testMappings)
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --background-color-th_base: light-dark(#fcfcfc, #191919);
          --text-color-th_base: light-dark(#202020, #eeeeee);
        }
      }"
    `)
  })

  test('converts px values', () => {
    const theme = {
      colorScheme: 'light',
      frameRadius: 14,
    }
    const { tailwindCss } = parseJsonTheme(JSON.stringify(theme), testMappings)
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --radius-th_frame: 14px;
        }
      }"
    `)
  })

  test('throws on null values', () => {
    const theme = { accent: null }
    expect(() =>
      parseJsonTheme(JSON.stringify(theme), testMappings),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Invalid theme JSON: missing or invalid colorScheme]',
    )
  })

  test('lowercases hex color values', () => {
    const theme = {
      accent: '#FFFFFF',
      colorScheme: 'light',
    }
    const { tailwindCss } = parseJsonTheme(JSON.stringify(theme), testMappings)
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: light-dark(#ffffff, #ffffff);
        }
      }"
    `)
  })

  test('handles transparent color value', () => {
    const theme = {
      accent: 'transparent',
      colorScheme: 'light',
    }
    const { tailwindCss } = parseJsonTheme(JSON.stringify(theme), testMappings)
    expect(tailwindCss).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: light-dark(transparent, transparent);
        }
      }"
    `)
  })

  test('throws on invalid JSON', () => {
    expect(() => parseJsonTheme('invalid json')).toThrow()
  })
})

describe('formatCssValue', () => {
  test('formats color type with hex value', () => {
    const result = formatCssValue('#ff007a', 'color', 'light')
    expect(result).toMatchInlineSnapshot(`"light-dark(#ff007a, #ff007a)"`)
  })

  test('formats color type with transparent', () => {
    const result = formatCssValue('transparent', 'color', 'light')
    expect(result).toMatchInlineSnapshot(
      `"light-dark(transparent, transparent)"`,
    )
  })

  test('formats color type with light-dark array', () => {
    const result = formatCssValue(['#ffffff', '#000000'], 'color', 'light dark')
    expect(result).toMatchInlineSnapshot(`"light-dark(#ffffff, #000000)"`)
  })

  test('formats px type', () => {
    const result = formatCssValue(14, 'px', 'light')
    expect(result).toMatchInlineSnapshot(`"14px"`)
  })

  test('throws on invalid color values', () => {
    expect(() =>
      formatCssValue(123, 'color', 'light'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: number for type color]',
    )
  })

  test('throws on invalid px values', () => {
    expect(() =>
      formatCssValue('#FF007A', 'px', 'light'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: string for type px]',
    )
  })

  test('throws on nullish values', () => {
    expect(() =>
      formatCssValue(null, 'color', 'light'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: object for type color]',
    )
    expect(() =>
      formatCssValue(undefined, 'color', 'light'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: undefined for type color]',
    )
  })
})
