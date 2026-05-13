import { useReaderStore } from '@/store/readerStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useDocumentStore } from '@/store/documentStore';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Sun, Moon, Settings, Eye, ScanSearch, SearchCode,
  FileText, BrainCircuit,
} from 'lucide-react';
import type { ReaderMode } from '@/types';

const MODES: Array<{ key: ReaderMode; label: string; icon: React.ReactNode; shortcut: string }> = [
  { key: 'input', label: 'Input', icon: <FileText className="h-4 w-4" />, shortcut: '1' },
  { key: 'skim', label: 'Skim', icon: <ScanSearch className="h-4 w-4" />, shortcut: '2' },
  { key: 'guided', label: 'Guided Scan', icon: <Eye className="h-4 w-4" />, shortcut: '3' },
  { key: 'deep', label: 'Deep Review', icon: <SearchCode className="h-4 w-4" />, shortcut: '4' },
];

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const mode = useReaderStore(s => s.mode);
  const setMode = useReaderStore(s => s.setMode);
  const theme = useSettingsStore(s => s.theme);
  const setTheme = useSettingsStore(s => s.setTheme);
  const apiKey = useSettingsStore(s => s.apiKey);
  const fileName = useDocumentStore(s => s.fileName);

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-primary">Read</span>Forge
        </span>
        {fileName && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {fileName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        {MODES.map((m) => (
          <Tooltip key={m.key} content={`${m.label} (${m.shortcut})`}>
            <Button
              variant={mode === m.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode(m.key)}
              className="gap-1.5"
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
            </Button>
          </Tooltip>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content={apiKey ? 'AI: Connected (DeepSeek)' : 'AI: Offline — Configure in Settings'}>
          <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
            apiKey
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          }`}>
            <BrainCircuit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'AI Ready' : 'AI Offline'}</span>
          </div>
        </Tooltip>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
