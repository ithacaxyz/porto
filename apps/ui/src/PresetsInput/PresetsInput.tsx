import { a, useTransition } from '@react-spring/web'
import type { KeyboardEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import LucidePencil from '~icons/lucide/pencil'
import LucideX from '~icons/lucide/x'
import { css, cx } from '../../styled-system/css'
import { Input } from '../Input/Input.js'

export interface PresetsInputProps {
  className?: string
  defaultPreset?: string
  onChange: (value: string) => void
  placeholder?: string
  presets: Array<{
    id: string
    label: ReactNode
    value: string
  }>
}

export function PresetsInput({
  className,
  defaultPreset,
  placeholder,
  onChange,
  presets,
  ...props
}: PresetsInputProps) {
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const editButtonRef = useRef<HTMLButtonElement>(null)

  const [selectedPreset, setSelectedPreset] = useState(
    defaultPreset ?? presets[0]?.id ?? '',
  )
  const [inputValue, setInputValue] = useState('')
  const [customMode, setCustomMode] = useState(false)
  const handlePresetChange = (id: string) => {
    setSelectedPreset(id)
    onChange(presets.find((item) => item.id === id)?.value || '')
  }
  const handleInputChange = (value: string) => {
    setInputValue(value)
    onChange(value)
  }
  const handleCustomModeChange = (enabled: boolean) => {
    setCustomMode(enabled)
    onChange(
      enabled
        ? inputValue
        : presets.find((item) => item.id === selectedPreset)?.value || '',
    )
  }

  useEffect(() => {
    const button = buttonsRef.current.get(selectedPreset)
    if (
      button &&
      document.activeElement?.parentElement === button.parentElement
    ) {
      button.focus()
    }
  }, [selectedPreset])

  const handleRadioKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = presets.findIndex((item) => item.id === selectedPreset)

    let nextIndex: number | undefined

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

    if (nextIndex !== undefined && presets[nextIndex]) {
      handlePresetChange((presets[nextIndex] as { id: string }).id)
    }
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
    keys: (item) => item.id,
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
                    autoFocus
                    className={css({
                      borderRadius: 16,
                      flex: 1,
                      minWidth: 200,
                    })}
                    onChange={(event) =>
                      handleInputChange?.(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Escape' && inputValue.trim() === '') {
                        handleCustomModeChange(false)
                        editButtonRef.current?.focus()
                      }
                    }}
                    placeholder={placeholder}
                    size="medium"
                    value={inputValue}
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
                aria-checked={selectedPreset === item.id}
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
                key={item.id}
                onClick={() => handlePresetChange(item.id)}
                ref={(el) => {
                  if (el) buttonsRef.current.set(item.id, el)
                  else buttonsRef.current.delete(item.id)
                }}
                role="radio"
                style={styles}
                tabIndex={selectedPreset === item.id ? 0 : -1}
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
        onClick={() => handleCustomModeChange(!customMode)}
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
