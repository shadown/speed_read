import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { GitCompare } from 'lucide-react';

export function DiffInput() {
  const [diffText, setDiffText] = useState('');
  const setRawText = useDocumentStore(s => s.setRawText);
  const setMode = useReaderStore(s => s.setMode);

  const handleLoad = () => {
    if (!diffText.trim()) return;
    setRawText(diffText);
    setMode('deep');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Paste a code diff / patch</label>
        <span className="text-xs text-muted-foreground">
          Unified diff format (.diff / .patch)
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-3 text-muted-foreground">
          <GitCompare className="h-4 w-4" />
        </div>
        <textarea
          value={diffText}
          onChange={(e) => setDiffText(e.target.value)}
          placeholder={`diff --git a/src/app.ts b/src/app.ts\n--- a/src/app.ts\n+++ b/src/app.ts\n@@ -10,6 +10,8 @@\n...`}
          className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm font-mono shadow-sm resize-y
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              handleLoad();
            }
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {diffText ? `${diffText.split('\n').filter(l => l.startsWith('+') || l.startsWith('-')).length} changed lines` : ''}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDiffText('')} disabled={!diffText}>
            Clear
          </Button>
          <Button size="sm" onClick={handleLoad} disabled={!diffText.trim()}>
            Analyze Diff
          </Button>
        </div>
      </div>
    </div>
  );
}
