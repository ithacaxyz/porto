import { a, useTransition } from '@react-spring/web'
import type { KeyboardEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import LucidePencil from '~icons/lucide/pencil'
import LucideX from '~icons/lucide/x'
import { css, cx } from '../../styled-system/css'
import { Input } from '../Input/Input.js'
import type { InputProps } from '../Input/Input.js'

export interface PresetsInputProps {
  adornments?: InputProps['adornments']
  className?: string
  mode?: 'preset' | 'custom'
  onModeChange?: (mode: 'preset' | 'custom') => void
  onChange: (value: string) => void
  placeholder?: string
  presets: Array<{ label: ReactNode; value: string }>
  value: string
  formatValue?: (value: string) => string
}

export function PresetsInput({
  adornments,
  className,
  mode: controlledMode,
  onModeChange,
  placeholder,
  onChange,
  presets,
  value,
  formatValue,
  ...props
}: PresetsInputProps) {
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const editButtonRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    if (mode !== 'preset') return
    const button = buttonsRef.current.get(value)
    if (
      button &&
      document.activeElement?.parentElement === button.parentElement
    ) {
      button.focus()
    }
  }, [value, mode])

  const handleRadioKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = presets.findIndex((item) => item.value === value)

    let nextIndex: null | number = null

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : presets.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = currentIndex < presets.length - 1 ? currentIndex + 1 : 0
        break
    }

    if (nextIndex === null) return
    const preset = presets[nextIndex]
    if (preset) handlePresetChange(preset.value)
  }

  const presetsTransition = useTransition(customMode ? [] : presets, {
    config: {
      friction: 100,
      mass: 1,
      tension: 3000,
    },
    enter: { opacity: 1, transform: ' scale(1)' },
    from: { opacity: 0, transform: ' scale(0.85)' },
    initial: { opacity: 1, transform: ' scale(1)' },
    keys: (item) => item.value,
    leave: { immediate: true, opacity: 0 },
    trail: 20,
  })

  const customInputTransition = useTransition(customMode, {
    config: {
      friction: 80,
      mass: 1,
      tension: 2000,
    },
    enter: {
      buttonTransform: 'scale(1)',
      opacity: 1,
      transform: 'scale(1, 1)',
    },
    from: {
      buttonTransform: 'scale(0)',
      opacity: 0,
      transform: 'scale(0.98, 0.95)',
    },
    initial: {
      buttonTransform: 'scale(1)',
      opacity: 1,
      transform: 'scale(1, 1)',
    },
    leave: {
      immediate: true,
      opacity: 0,
    },
  })

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
          customInputTransition(
            (styles, item) =>
              item && (
                <a.div
                  className={css({
                    inset: 0,
                    position: 'absolute',
                  })}
                  style={styles}
                >
                  <Input
                    adornments={adornments}
                    autoFocus
                    className={css({
                      borderRadius: 16,
                      flex: 1,
                      minWidth: 200,
                    })}
                    formatValue={formatValue}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        handleModeChange('preset')
                        editButtonRef.current?.focus()
                      }
                    }}
                    placeholder={placeholder}
                    size="medium"
                    value={value}
                  />
                </a.div>
              ),
          )
        ) : (
          <div
            className={css({
              alignItems: 'center',
              display: 'grid',
              gap: 8,
              inset: 0,
              position: 'absolute',
            })}
            onKeyDown={handleRadioKeyDown}
            role="radiogroup"
            style={{
              gridTemplateColumns: `repeat(${presets.length}, minmax(72px, 1fr))`,
            }}
          >
            {presetsTransition((styles, item) => (
              // biome-ignore lint/a11y/useSemanticElements: _
              <a.button
                aria-checked={value === item.value}
                className={css({
                  _active: {
                    transform: 'translateY(1px)',
                  },
                  _checked: {
                    borderColor: 'var(--color-th_accent)',
                    borderWidth: 2,
                    color: 'var(--text-color-th_field)',
                  },
                  _focusVisible: {
                    outline: '2px solid var(--color-th_focus)',
                    outlineOffset: 2,
                  },
                  alignItems: 'center',
                  backgroundColor: 'transparent',
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
                })}
                key={item.value}
                onClick={() => handlePresetChange(item.value)}
                ref={(el) => {
                  if (el) buttonsRef.current.set(item.value, el)
                  else buttonsRef.current.delete(item.value)
                }}
                role="radio"
                style={styles}
                tabIndex={value === item.value ? 0 : -1}
                type="button"
                {...props}
              >
                {item.label}
              </a.button>
            ))}
          </div>
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
        ref={editButtonRef}
        title={customMode ? 'Back to presets' : 'Custom value'}
        type="button"
      >
        {customInputTransition((styles, customMode) => (
          <a.div
            className={css({
              display: 'grid',
              inset: 0,
              placeItems: 'center',
              position: 'absolute',
            })}
            style={{
              opacity: styles.opacity,
              transform: styles.buttonTransform,
            }}
          >
            {customMode ? <LucideX /> : <LucidePencil />}
          </a.div>
        ))}
      </button>
    </div>
  )
}
