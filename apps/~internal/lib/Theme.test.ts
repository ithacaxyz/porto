import { describe, expect, test } from 'vitest'
import { formatCssValue, formatTailwindTheme } from './Theme.js'

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

describe('formatTailwindTheme', () => {
  test('converts porto theme to tailwind', () => {
    const theme = {
      accent: '#FF007A',
      baseBackground: '#FCFCFC',
      primaryBackground: '#0090ff',
    }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: #ff007a;
          --background-color-th_base: #fcfcfc;
          --background-color-th_primary: #0090ff;
      }
      }"
    `)
  })

  test('converts light-dark color values', () => {
    const theme = {
      baseBackground: ['#fcfcfc', '#191919'],
      baseContent: ['#202020', '#eeeeee'],
    }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --background-color-th_base: light-dark(
            #fcfcfc,
            #191919
          );
          --text-color-th_base: light-dark(
            #202020,
            #eeeeee
          );
      }
      }"
    `)
  })

  test('converts px values', () => {
    const theme = {
      frameRadius: 14,
    }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --radius-th_frame: 14px;
      }
      }"
    `)
  })

  test('handles mixed theme values', () => {
    const theme = {
      accent: '#FF007A',
      baseBackground: ['#fcfcfc', '#191919'],
      frameRadius: 14,
      primaryBackground: '#0090ff',
      primaryContent: '#FFFFFF',
    }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: #ff007a;
          --background-color-th_base: light-dark(
            #fcfcfc,
            #191919
          );
          --background-color-th_primary: #0090ff;
          --text-color-th_primary: #ffffff;
          --radius-th_frame: 14px;
      }
      }"
    `)
  })

  test('throws on null values', () => {
    const theme = { accent: null }
    expect(() =>
      formatTailwindTheme(JSON.stringify(theme), testMappings),
    ).toThrow()
  })

  test('lowercases hex color values', () => {
    const theme = { accent: '#FFFFFF' }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: #ffffff;
      }
      }"
    `)
  })

  test('handles transparent color value', () => {
    const theme = { accent: 'transparent' }
    const result = formatTailwindTheme(JSON.stringify(theme), testMappings)
    expect(result).toMatchInlineSnapshot(`
      "@layer theme {
        :root, :host {
          --color-th_accent: transparent;
      }
      }"
    `)
  })

  test('throws on invalid JSON', () => {
    expect(() => formatTailwindTheme('invalid json')).toThrow()
  })
})

describe('formatCssValue', () => {
  test('formats color type with hex value', () => {
    const result = formatCssValue('#ff007a', 'color')
    expect(result).toMatchInlineSnapshot(`"#ff007a"`)
  })

  test('formats color type with transparent', () => {
    const result = formatCssValue('transparent', 'color')
    expect(result).toMatchInlineSnapshot(`"transparent"`)
  })

  test('formats color type with light-dark array', () => {
    const result = formatCssValue(['#ffffff', '#000000'], 'color')
    expect(result).toMatchInlineSnapshot(`
      "light-dark(
            #ffffff,
            #000000
          )"
    `)
  })

  test('formats px type', () => {
    const result = formatCssValue(14, 'px')
    expect(result).toMatchInlineSnapshot(`"14px"`)
  })

  test('throws on invalid color values', () => {
    expect(() =>
      formatCssValue(123, 'color'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: number for type color]',
    )
  })

  test('throws on invalid px values', () => {
    expect(() =>
      formatCssValue('#FF007A', 'px'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: string for type px]',
    )
  })

  test('throws on nullish values', () => {
    expect(() =>
      formatCssValue(null, 'color'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: object for type color]',
    )
    expect(() =>
      formatCssValue(undefined, 'color'),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Unsupported theme value type: undefined for type color]',
    )
  })
})
