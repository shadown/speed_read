import { useEffect } from 'react';
import { useReaderStore } from '@/store/readerStore';
import { useSettingsStore } from '@/store/settingsStore';

interface KeyboardShortcutMap {
  [key: string]: ((e: KeyboardEvent) => void) | (() => void);
}

/**
 * useKeyboardShortcuts — Global keyboard shortcut handler
 */
export function useKeyboardShortcuts() {
  const {
    mode, setMode,
    togglePlay, goBack, goForward,
    setWpm, wpm,
  } = useReaderStore();

  const { setTheme, theme } = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Still allow Escape in inputs
        if (e.key === 'Escape') return;
        return;
      }

      const shortcuts: KeyboardShortcutMap = {
        // Mode switching
        '1': () => setMode('input'),
        '2': () => setMode('skim'),
        '3': () => setMode('guided'),
        '4': () => setMode('deep'),

        // Theme
        't': () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      };

      // Guided Scan specific shortcuts
      if (mode === 'guided') {
        Object.assign(shortcuts, {
          ' ': (ev: KeyboardEvent) => {
            ev.preventDefault();
            togglePlay();
          },
          'ArrowLeft': () => goBack(1),
          'ArrowRight': () => goForward(1),
          '[': () => goBack(10),
          ']': () => goForward(10),
          '-': () => setWpm(wpm - 50),
          '=': () => setWpm(wpm + 50),
        });
      }

      // Deep Review specific shortcuts
      if (mode === 'deep') {
        Object.assign(shortcuts, {
          'j': () => goForward(1),
          'k': () => goBack(1),
        });
      }

      const handler = shortcuts[e.key];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, wpm, theme, setMode, togglePlay, goBack, goForward, setWpm, setTheme]);
}
