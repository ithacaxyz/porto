import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

const STORAGE_KEY = 'porto-ui-color-scheme'

function getOrSetColorScheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored

  const system = matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  localStorage.setItem(STORAGE_KEY, system)
  return system
}

const ColorSchemeContext = createContext<{
  colorScheme: 'dark' | 'light'
  setColorScheme: (scheme: 'dark' | 'light') => void
}>({
  colorScheme: 'light',
  setColorScheme: () => {},
})

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>(() =>
    getOrSetColorScheme(),
  )

  const update = (scheme: 'dark' | 'light') => {
    setColorScheme(scheme)
    localStorage.setItem(STORAGE_KEY, scheme)
  }

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', colorScheme === 'dark')
    html.classList.toggle('light', colorScheme === 'light')
  }, [colorScheme])

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme: update,
      }}
    >
      <style>
        {`
          :root {
            color-scheme: ${colorScheme};
          }
        `}
      </style>
      {children}
    </ColorSchemeContext.Provider>
  )
}

export function useColorScheme() {
  return useContext(ColorSchemeContext)
}
