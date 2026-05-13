import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { GitCompare } from 'lucide-react';

export function DiffInput() {
  const [text, setText] = useState('');
  const setRawText = useDocumentStore((s) => s.setRawText);
  const setMode = useReaderStore((s) => s.setMode);

  const changeCount = text
    ? text.split('\n').filter((l) => l.startsWith('+') || l.startsWith('-')).length
    : 0;

  const handleLoad = () => {
    if (!text.trim()) return;
    setRawText(text);
    setMode('deep');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Paste code diff</label>
        <span className="text-[11px] text-muted-foreground/60">Unified diff format</span>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-3.5 text-muted-foreground/40 pointer-events-none">
          <GitCompare className="h-4 w-4" />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`diff --git a/src/app.ts b/src/app.ts\n--- a/src/app.ts\n+++ b/src/app.ts\n@@ -10,6 +10,8 @@\n ...`}
          className="w-full h-52 rounded-lg border border-input bg-background px-4 py-3 pl-10 text-xs font-mono shadow-sm resize-y
            placeholder:text-muted-foreground/40
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            transition-shadow duration-150"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleLoad();
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/60 tabular-nums">
          {text ? `${changeCount} changed lines` : ''}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setText('')} disabled={!text}>
            Clear
          </Button>
          <Button size="sm" onClick={handleLoad} disabled={!text.trim()}>
            Analyze{changeCount > 0 && ` (${changeCount} changes)`}
          </Button>
        </div>
      </div>
    </div>
  );
}
