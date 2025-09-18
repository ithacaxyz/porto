import { CopyButton } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import { portoTheme } from '../../../theme/porto-theme'
import * as radixDark from '../radix-dark'
import * as radixLight from '../radix-light'

function findRadixColor(
  hexColor: string,
  mode: 'light' | 'dark',
): { theme: string; name: string } | null {
  const radixColors = mode === 'light' ? radixLight : radixDark

  for (const [themeName, themeColors] of Object.entries(radixColors))
    if (typeof themeColors === 'object' && themeColors !== null)
      for (const [colorName, colorValue] of Object.entries(themeColors))
        if (
          typeof colorValue === 'string' &&
          colorValue.toLowerCase() === hexColor.toLowerCase()
        )
          return { name: colorName, theme: themeName }

  return null
}

export const Route = createFileRoute('/Colors')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Theme">
      <div className="grid gap-8">
        {Object.entries(portoTheme)
          .filter(([_, value]) => Array.isArray(value) && value.length === 3)
          .map(([name, value]) => {
            const [desc, light, dark] = value as [
              string,
              `#${string}`,
              `#${string}`,
            ]
            return (
              <div className="flex flex-col gap-2" key={name}>
                <h2 className="text-lg text-th_base">{name}</h2>
                <div className="grid h-30 grid-cols-2">
                  <ColorButton color={light} mode="light" side="left" />
                  <ColorButton color={dark} mode="dark" side="right" />
                </div>
                <div className="mb-2 text-sm text-th_base-secondary leading-[1.5]">
                  {desc}
                </div>
              </div>
            )
          })}
      </div>
    </ComponentScreen>
  )
}

function ColorButton({
  color,
  mode,
  side,
}: {
  color: `#${string}`
  mode: 'light' | 'dark'
  side: 'left' | 'right'
}) {
  const radixMatch = findRadixColor(color, mode)
  const { copy, notifying } = CopyButton.useCopy()

  return (
    <button
      className={cx(
        'relative flex cursor-pointer! flex-col items-end border border-th_frame p-6 outline-0 outline-th_focus outline-offset-1 focus-visible:z-1 focus-visible:outline-2 active:translate-y-[1px]',
        side === 'left'
          ? 'rounded-l-th_medium border-r-0'
          : 'rounded-r-th_medium border-l-0',
      )}
      key={mode}
      onClick={() => copy(color)}
      style={{
        backgroundColor: color.slice(0, 7), // remove alpha if present
        color: colorIntensity(color) === 'high' ? '#000' : '#fff',
      }}
      type="button"
    >
      <div>{mode}</div>
      <div className="mt-1 flex flex-col items-end">
        <div className="relative">
          <div className="absolute right-[calc(100%+8px)] flex h-full items-center">
            {notifying && (
              <div className="flex items-center text-sm">copied</div>
            )}
          </div>
          {color}
        </div>
        <div className="text-xs">
          {radixMatch
            ? `radix: ${radixMatch.theme}.${radixMatch.name}`
            : '<no radix match>'}
        </div>
      </div>
    </button>
  )
}

// thanks https://stackoverflow.com/a/3943023
function colorIntensity(hex: `#${string}`): 'high' | 'low' {
  if (!/^#[0-9A-Fa-f]{6,8}$/.test(hex))
    throw new Error(`Invalid hex color: ${hex}`)
  const [r, g, b] = [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
  const intensity = r * 0.299 + g * 0.587 + b * 0.114
  return intensity > 186 ? 'high' : 'low'
}
