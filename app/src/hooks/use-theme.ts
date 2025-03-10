import * as React from 'react'

type ThemeMode = 'light' | 'dark'

export function useThemeMode(): {
  theme: ThemeMode
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>
} {
  const [theme, setTheme] = React.useState<ThemeMode>('light')

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
      localStorage.setItem('__porto_theme', event.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleMediaQueryChange)

    const handleStorageChange = (event: StorageEvent) => {
      console.info(event)
      if (event.key === '__porto_theme') {
        setTheme(event.newValue === 'dark' ? 'dark' : 'light')
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  React.useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  return { theme, setTheme }
}
