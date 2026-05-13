import { useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * useTheme — Ensures the DOM class matches the current theme setting.
 * Runs once on mount and whenever theme changes.
 */
export function useTheme() {
  const theme = useSettingsStore(s => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
}
