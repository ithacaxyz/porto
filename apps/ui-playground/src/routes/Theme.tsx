import { createFileRoute } from '@tanstack/react-router'
import { useId } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import { portoTheme } from '../../../theme/porto-theme.js'

export const Route = createFileRoute('/Theme')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ComponentScreen title="Theme">
      <div className="grid gap-8">
        {Object.entries(portoTheme)
          .filter(([name]) => name !== 'colorScheme')
          .map(([name, value]) => {
            if (value === 'light dark') throw new Error()
            const [description, ...colorPairOrNumber] = value
            return (
              <div className="flex flex-col gap-2" key={name}>
                <h2 className="text-lg text-th_base">{name}</h2>
                <p className="text-th_base-secondary">{description}</p>
                <div className="pt-2">
                  {typeof colorPairOrNumber[0] === 'number' ? (
                    <div className="text-th_base-secondary">
                      {(colorPairOrNumber as [number])[0]}px
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {['light', 'dark'].map((mode, index) => (
                        <div className="flex flex-col gap-1" key={mode}>
                          <div className="text-s text-th_base-secondary">
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </div>
                          <ColorSwatch
                            color={colorPairOrNumber[index] as string}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </ComponentScreen>
  )
}

function ColorSwatch({ color }: { color: string }) {
  const id = useId()
  return (
    <div className="flex items-center overflow-hidden whitespace-nowrap rounded-th_medium border-1 border-th_base-secondary border-th_frame bg-th_frame text-th_frame">
      <label
        className="size-7 flex-shrink-0"
        htmlFor={id}
        style={{ backgroundColor: color }}
        aria-label={color}
      />
      <input
        className="h-full w-24 overflow-hidden text-ellipsis whitespace-nowrap bg-th_frame px-3 text-inherit outline-none"
        id={id}
        onFocus={(e) => e.currentTarget.select()}
        readOnly
        type="text"
        value={color}
      />
    </div>
  )
}
