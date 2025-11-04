// src/utils/theme.js
const KEY = 'qc_theme'

export function applyInitialTheme() {
  const saved = localStorage.getItem(KEY) || 'dark'
  document.documentElement.dataset.theme = saved
}

export function setTheme(next) {
  document.documentElement.dataset.theme = next
  localStorage.setItem(KEY, next)
}

export function getTheme() {
  return document.documentElement.dataset.theme || 'dark'
}
