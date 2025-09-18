import { Radio, RadioGroup, RadioProvider } from '@ariakit/react'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import LucidePencil from '~icons/lucide/pencil'
import LucideX from '~icons/lucide/x'
import { css, cx } from '../../styled-system/css'
import { Input } from '../Input/Input.js'

export function PresetsInput({
  adornments,
  className,
  mode: controlledMode,
  onModeChange,
  onChange,
  presets,
  value,
  ...inputProps
}: PresetsInput.Props) {
  const radioGroupRef = useRef<HTMLDivElement>(null)
  const [internalMode, setInternalMode] = useState<'preset' | 'custom'>(
    'preset',
  )
  const mode = controlledMode ?? internalMode
  const customMode = mode === 'custom'
  const handlePresetChange = (presetValue: string) => {
    onChange(presetValue)
  }
  const handleInputChange = (newValue: string) => {
    onChange(newValue)
  }

  const handleModeChange = (newMode: 'preset' | 'custom') => {
    if (controlledMode === undefined) {
      setInternalMode(newMode)
    }
    onModeChange?.(newMode)
    if (newMode === 'preset' && presets.length > 0) {
      const currentPreset = presets.find((p) => p.value === value)
      if (!currentPreset && presets[0]) {
        onChange(presets[0].value)
      }
    }
  }

  return (
    <div
      className={cx(
        css({
          alignItems: 'center',
          display: 'flex',
          gap: 8,
          height: 38,
          width: '100%',
        }),
        className,
      )}
    >
      <div
        className={css({
          display: 'flex',
          flex: '1 0 auto',
          height: '100%',
          position: 'relative',
        })}
      >
        {customMode ? (
          <div
            className={css({
              inset: 0,
              position: 'absolute',
            })}
          >
            <Input
              adornments={adornments}
              autoFocus
              className={css({
                borderRadius: 16,
                flex: 1,
              })}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  // prevent closing the modal
                  event.stopPropagation()

                  handleModeChange('preset')

                  // wait for RadioGroup to get rendered
                  queueMicrotask(() => {
                    radioGroupRef.current
                      ?.querySelector('input:checked')
                      ?.focus()
                  })
                }
              }}
              size="medium"
              value={value}
              {...inputProps}
            />
          </div>
        ) : (
          <RadioProvider
            setValue={(value) => handlePresetChange(value as string)}
            value={value}
          >
            <RadioGroup ref={radioGroupRef}>
              <div
                className={css({
                  alignItems: 'center',
                  display: 'grid',
                  gap: 8,
                  inset: 0,
                  position: 'absolute',
                })}
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
                }}
              >
                {presets.map((item) => (
                  // biome-ignore lint/a11y/noLabelWithoutControl: Radio contains a control
                  <label
                    className={css({
                      display: 'block',
                      position: 'relative',
                    })}
                    key={item.value}
                  >
                    <Radio
                      className={cx(
                        'peer',
                        css({
                          // We can't use Ariakit's VisuallyHidden here, as
                          // it would add an element and prevent using peer
                          // selectors to style the buttons states. Instead
                          // we juste place it behind the button-like.
                          height: 1,
                          left: '50%',
                          position: 'absolute',
                          top: '50%',
                          width: 1,
                        }),
                      )}
                      value={item.value}
                    />
                    <div
                      className={css({
                        _peerActive: {
                          transform: 'translateY(1px)',
                        },
                        _peerChecked: {
                          borderColor: 'var(--color-th_accent)',
                          borderWidth: 2,
                          color: 'var(--text-color-th_field)',
                        },
                        _peerFocusVisible: {
                          outline: '2px solid var(--color-th_focus)',
                          outlineOffset: 2,
                        },
                        alignItems: 'center',
                        background: 'var(--background-color-th_base)',
                        border: '1px solid var(--border-color-th_field)',
                        borderRadius: 'var(--radius-th_medium)',
                        color: 'var(--text-color-th_field-secondary)',
                        cursor: 'pointer!',
                        display: 'flex',
                        fontSize: 15,
                        height: 38,
                        justifyContent: 'center',
                        outline: 'none',
                        position: 'relative',
                        userSelect: 'none',
                      })}
                    >
                      <span>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </RadioProvider>
        )}
      </div>
      <button
        className={css({
          _active: {
            transform: 'translateY(1px)',
          },
          _focusVisible: {
            outline: '2px solid var(--color-th_focus)',
            outlineOffset: 2,
          },
          background: 'var(--background-color-th_base)',
          border: '1px solid var(--border-color-th_field)',
          borderRadius: 'var(--radius-th_medium)',
          color: 'var(--text-color-th_field-secondary)',
          cursor: 'pointer!',
          display: 'grid',
          flex: '0 0 auto',
          height: 38,
          outline: 0,
          placeItems: 'center',
          position: 'relative',
          width: 38,
        })}
        onClick={() => handleModeChange(customMode ? 'preset' : 'custom')}
        title={customMode ? 'Back to presets' : 'Custom value'}
        type="button"
      >
        {customMode ? <LucideX /> : <LucidePencil />}
      </button>
    </div>
  )
}

export namespace PresetsInput {
  export interface Props extends Input.Props {
    mode?: 'preset' | 'custom'
    onModeChange?: (mode: 'preset' | 'custom') => void
    presets: Array<{ label: ReactNode; value: string }>
  }
}
