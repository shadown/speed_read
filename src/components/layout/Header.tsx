import { useReaderStore } from '@/store/readerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useDocumentStore } from '@/store/documentStore';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Sun, Moon, Settings, Eye, ScanSearch, SearchCode,
  FileText, BrainCircuit,
} from 'lucide-react';
import type { ReaderMode } from '@/types';

const MODES: Array<{
  key: ReaderMode;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
}> = [
  { key: 'input', label: 'Input', icon: <FileText className="h-4 w-4" />, shortcut: '1' },
  { key: 'skim', label: 'Skim', icon: <ScanSearch className="h-4 w-4" />, shortcut: '2' },
  { key: 'guided', label: 'Scan', icon: <Eye className="h-4 w-4" />, shortcut: '3' },
  { key: 'deep', label: 'Review', icon: <SearchCode className="h-4 w-4" />, shortcut: '4' },
];

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const mode = useReaderStore((s) => s.mode);
  const setMode = useReaderStore((s) => s.setMode);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const apiKey = useSettingsStore((s) => s.apiKey);
  const fileName = useDocumentStore((s) => s.fileName);

  return (
    <header className="flex h-14 items-center justify-between border-b glass z-40 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base font-bold tracking-tight shrink-0">
          <span className="text-primary">Read</span>
          <span className="text-muted-foreground/30">Forge</span>
        </span>
        {fileName && (
          <>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-sm text-muted-foreground/70 truncate max-w-[160px] font-medium">
              {fileName}
            </span>
          </>
        )}
      </div>

      {/* Mode switcher */}
      <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border">
        {MODES.map((m) => {
          const active = mode === m.key;
          return (
            <Tooltip key={m.key} content={`${m.label} (${m.shortcut})`}>
              <button
                onClick={() => setMode(m.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* AI status pill */}
        <Tooltip
          content={
            apiKey
              ? 'AI connected via DeepSeek'
              : 'AI offline — add API key in Settings'
          }
        >
          <div
            className={cn(
              'flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full transition-colors',
              apiKey
                ? 'bg-green-500/8 text-green-600 dark:text-green-400'
                : 'bg-muted text-muted-foreground/60',
            )}
          >
            <BrainCircuit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'AI Ready' : 'Offline'}</span>
          </div>
        </Tooltip>

        {/* Theme */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
