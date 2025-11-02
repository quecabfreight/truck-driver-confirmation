import { useTheme } from '../theme/ThemeProvider.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="toggle" onClick={toggle} aria-label="Toggle theme" title="Toggle Light/Dark">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
