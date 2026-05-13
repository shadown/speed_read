import { useState, useCallback } from 'react';
import { Header } from './Header';
import { InputPage } from '@/components/reader/InputPage';
import { SkimPage } from '@/components/reader/SkimPage';
import { GuidedScanPage } from '@/components/reader/GuidedScanPage';
import { DeepReviewPage } from '@/components/reader/DeepReviewPage';
import { SettingsDialog } from '@/components/Settings';
import { ShortcutsHelp } from '@/components/ShortcutsHelp';
import { useReaderStore } from '@/store/readerStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { Keyboard } from 'lucide-react';

export function AppShell() {
  const mode = useReaderStore((s) => s.mode);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Global hooks
  useTheme();
  useKeyboardShortcuts();

  const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);

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
      <Header onOpenSettings={handleOpenSettings} />
      <main className="flex-1 overflow-auto">{renderMode()}</main>

      {/* Footer bar */}
      <footer className="hidden md:flex items-center justify-center gap-5 h-8 border-t glass px-4 text-[11px] text-muted-foreground/50">
        <span>
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[9px] font-mono">1</kbd>
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[9px] font-mono ml-0.5">4</kbd>
          {' '}Modes
        </span>
        <span>
          <kbd className="inline-flex items-center justify-center px-1 h-4 rounded bg-muted text-[9px] font-mono">Space</kbd>
          {' '}Play
        </span>
        <span>
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[9px] font-mono">←</kbd>
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[9px] font-mono ml-0.5">→</kbd>
          {' '}Navigate
        </span>
        <span>
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[9px] font-mono">T</kbd>
          {' '}Theme
        </span>
        <button
          onClick={() => setShortcutsOpen(true)}
          className="inline-flex items-center gap-1 hover:text-foreground/70 transition-colors"
        >
          <Keyboard className="h-3 w-3" />
          Shortcuts
        </button>
      </footer>

      {/* Dialogs */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
