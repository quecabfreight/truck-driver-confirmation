import { getTheme, setTheme } from '../utils/theme.js'

export default function ThemeToggle() {
  const cur = getTheme()
  const isLight = cur === 'light'
  const isDark  = cur !== 'light'

  return (
    <div style={{ display:'flex', gap:8 }}>
      <button
        type="button"
        className="btn"
        onClick={() => setTheme('light')}
        style={{ opacity: isLight ? 1 : 0.6 }}
      >
        Light
      </button>
      <button
        type="button"
        className="btn"
        onClick={() => setTheme('dark')}
        style={{ opacity: isDark ? 1 : 0.6 }}
      >
        Dark
      </button>
    </div>
  )
}
