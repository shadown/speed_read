import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';

export function TextPaste() {
  const [text, setText] = useState('');
  const setRawText = useDocumentStore((s) => s.setRawText);
  const setMode = useReaderStore((s) => s.setMode);

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleLoad = () => {
    if (!text.trim()) return;
    setRawText(text);
    setMode('skim');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Paste content</label>
        <span className="text-[11px] text-muted-foreground/60">
          Plain text or Markdown
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste technical documents, RFCs, research papers, articles..."
        className="w-full h-52 rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm resize-y
          placeholder:text-muted-foreground/40
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          transition-shadow duration-150"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleLoad();
        }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/60 tabular-nums">
          {text ? `${wordCount} words` : ''}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setText('')} disabled={!text}>
            Clear
          </Button>
          <Button size="sm" onClick={handleLoad} disabled={!text.trim()}>
            Load{wordCount > 0 && ` (${wordCount}w)`}
          </Button>
        </div>
      </div>
    </div>
  );
}
