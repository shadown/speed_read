import { useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useSettingsStore } from '@/store/settingsStore';

export default function App() {
  const loadFromStorage = useSettingsStore(s => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <AppShell />;
}
