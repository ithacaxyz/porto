import * as React from 'react'

export function useWindowFocus(callback?: () => void) {
  const [isFocused, setIsFocused] = React.useState(true)
  const [wasBlurred, setWasBlurred] = React.useState(false)

  React.useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true)
      if (wasBlurred && callback) {
        callback()
        setWasBlurred(false)
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      setWasBlurred(true)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [callback, wasBlurred])

  return { isFocused, wasBlurred }
}
