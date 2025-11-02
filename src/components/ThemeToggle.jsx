import { useTheme } from '../theme/ThemeProvider.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <label className="theme-switch" title="Toggle Light/Dark">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggle}
        aria-label="Toggle Light/Dark theme"
      />
      <span className="slider" aria-hidden="true">
        <span className="thumb" />
        <span className="labels">
          <span className="lbl">Light</span>
          <span className="lbl">Dark</span>
        </span>
      </span>
    </label>
  )
}
