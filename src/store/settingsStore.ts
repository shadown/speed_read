import { create } from 'zustand';
import type { DeepSeekModel } from '@/types';

interface SettingsStore {
  apiKey: string;
  model: DeepSeekModel;
  theme: 'dark' | 'light';
  showComprehensionChecks: boolean;

  // Actions
  setApiKey: (key: string) => void;
  setModel: (model: DeepSeekModel) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setShowComprehensionChecks: (show: boolean) => void;
  resetToDefaults: () => void;
  loadFromStorage: () => void;
  persistToStorage: () => void;
}

const STORAGE_KEY = 'readforge-settings';
const DEFAULTS = {
  apiKey: '',
  model: 'deepseek-chat' as DeepSeekModel,
  theme: 'dark' as const,
  showComprehensionChecks: false,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULTS,

  setApiKey: (key: string) => {
    set({ apiKey: key });
    get().persistToStorage();
  },

  setModel: (model: DeepSeekModel) => {
    set({ model });
    get().persistToStorage();
  },

  setTheme: (theme: 'dark' | 'light') => {
    set({ theme });
    // Toggle the class on document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    get().persistToStorage();
  },

  setShowComprehensionChecks: (show: boolean) => {
    set({ showComprehensionChecks: show });
    get().persistToStorage();
  },

  resetToDefaults: () => {
    set({ ...DEFAULTS });
    document.documentElement.classList.add('dark');
    get().persistToStorage();
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          apiKey: parsed.apiKey || '',
          model: parsed.model || DEFAULTS.model,
          theme: parsed.theme || DEFAULTS.theme,
          showComprehensionChecks: parsed.showComprehensionChecks ?? DEFAULTS.showComprehensionChecks,
        });

        // Apply theme
        const theme = parsed.theme || DEFAULTS.theme;
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch {
      // Ignore corrupt storage
    }
  },

  persistToStorage: () => {
    const { apiKey, model, theme, showComprehensionChecks } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        apiKey,
        model,
        theme,
        showComprehensionChecks,
      }));
    } catch {
      // Storage full or unavailable — silently fail
    }
  },
}));
