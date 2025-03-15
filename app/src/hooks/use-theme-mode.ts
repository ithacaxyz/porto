import * as React from 'react'

type ThemeMode = 'light' | 'dark'

export function useThemeMode(): {
  theme: ThemeMode
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>
} {
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('__porto_theme')
      if (stored === 'dark' || stored === 'light') return stored
      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark'
    }
    return 'light'
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const localTheme = localStorage.getItem('__porto_theme')
    if (localTheme === theme) return

    if (theme === 'dark') {
      document.documentElement.classList.remove('scheme-light', 'scheme-light')
      document.documentElement.classList.add('scheme-dark')
    } else {
      document.documentElement.classList.remove('scheme-dark', 'scheme-light')
      document.documentElement.classList.add('scheme-light')
    }
    localStorage.setItem('__porto_theme', theme)
  }, [theme])

  return { theme, setTheme }
}
