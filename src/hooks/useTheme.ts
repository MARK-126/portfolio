import { useCallback, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

// The initial theme is set on <html> by the inline script in index.html (dark by default).
function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage can be unavailable (private mode); the theme still applies for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
