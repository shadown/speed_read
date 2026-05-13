import { useState } from 'react';
import { Header } from './Header';
import { InputPage } from '@/components/reader/InputPage';
import { SkimPage } from '@/components/reader/SkimPage';
import { GuidedScanPage } from '@/components/reader/GuidedScanPage';
import { DeepReviewPage } from '@/components/reader/DeepReviewPage';
import { SettingsDialog } from '@/components/Settings';
import { useReaderStore } from '@/store/readerStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';

export function AppShell() {
  const mode = useReaderStore(s => s.mode);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Initialize hooks
  useTheme();
  useKeyboardShortcuts();

  const renderMode = () => {
    switch (mode) {
      case 'input':
        return <InputPage />;
      case 'skim':
        return <SkimPage />;
      case 'guided':
        return <GuidedScanPage />;
      case 'deep':
        return <DeepReviewPage />;
      default:
        return <InputPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="flex-1 overflow-auto">
        {renderMode()}
      </main>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Keyboard shortcut hint */}
      <footer className="hidden md:flex items-center justify-center gap-4 h-8 border-t px-4 text-xs text-muted-foreground">
        <span><kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">1-4</kbd> Switch modes</span>
        <span><kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">← →</kbd> Navigate</span>
        <span><kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">T</kbd> Theme</span>
        <span><kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">?</kbd> Shortcuts</span>
      </footer>
    </div>
  );
}
