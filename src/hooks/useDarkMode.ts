import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function useDarkMode() {
  const { darkMode, setDarkMode, toggleDarkMode } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return { darkMode, setDarkMode, toggleDarkMode }
}
