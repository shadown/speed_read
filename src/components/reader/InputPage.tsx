import { TextPaste } from '@/components/input/TextPaste';
import { FileUpload } from '@/components/input/FileUpload';
import { DiffInput } from '@/components/input/DiffInput';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';
import { FileText, Upload, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputTab = 'paste' | 'upload' | 'diff';

const TABS = [
  { key: 'paste' as InputTab, label: 'Paste', icon: FileText },
  { key: 'upload' as InputTab, label: 'Upload', icon: Upload },
  { key: 'diff' as InputTab, label: 'Diff', icon: GitCompare },
];

export function InputPage() {
  const [tab, setTab] = useState<InputTab>('paste');

  return (
    <div className="mx-auto max-w-3xl py-10 px-4 space-y-8 animate-slide-up">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Read smarter,{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            not slower
          </span>
        </h1>
        <p className="text-sm text-muted-foreground/80 max-w-lg mx-auto leading-relaxed">
          Paste any technical document, upload a file, or drop a code diff.
          Read complex material 2–4× faster with AI-powered visualizations.
        </p>
      </div>

      {/* Input tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as InputTab)}>
        <TabsList className="w-full bg-muted/50 p-0.5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                'flex-1 gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all',
                tab === key && 'bg-background shadow-sm',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="paste">
          <TextPaste />
        </TabsContent>
        <TabsContent value="upload">
          <FileUpload />
        </TabsContent>
        <TabsContent value="diff">
          <DiffInput />
        </TabsContent>
      </Tabs>

      {/* Quick tips */}
      <div className="text-center text-xs text-muted-foreground/50 space-y-1.5 pt-4 border-t border-border/50">
        <p>
          <kbd className="inline-flex items-center justify-center px-1 h-4 rounded bg-muted text-[10px] font-mono">⌘⏎</kbd>
          {' '}to load{' · '}
          <kbd className="inline-flex items-center justify-center px-1 h-4 rounded bg-muted text-[10px] font-mono">1</kbd>
          –
          <kbd className="inline-flex items-center justify-center px-1 h-4 rounded bg-muted text-[10px] font-mono">4</kbd>
          {' '}switch modes{' · '}
          <kbd className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[10px] font-mono">?</kbd>
          {' '}shortcuts
        </p>
        <p className="text-[10px]">
          Add a DeepSeek API key in Settings to enable AI features
        </p>
      </div>
    </div>
  );
}
