import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeCtx = createContext({ theme: 'dark', toggle: () => {} })

function applyTheme(next) {
  const root = document.documentElement
  root.setAttribute('data-theme', next)
  localStorage.setItem('qc_theme', next)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('qc_theme')
    const initial = saved === 'light' || saved === 'dark' ? saved : 'dark'
    setTheme(initial)
    applyTheme(initial)
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return next
    })
  }

  const value = useMemo(() => ({ theme, toggle }), [theme])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
