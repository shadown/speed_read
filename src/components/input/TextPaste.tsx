import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';

export function TextPaste() {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setRawText = useDocumentStore(s => s.setRawText);
  const setMode = useReaderStore(s => s.setMode);

  const handleLoad = () => {
    if (!text.trim()) return;
    setRawText(text);
    setMode('skim');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Paste your content</label>
        <span className="text-xs text-muted-foreground">
          Supports plain text and Markdown
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste any text, markdown, technical RFC, research paper, or code review..."
        className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-y
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onKeyDown={(e) => {
          // Cmd/Ctrl + Enter to load
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleLoad();
          }
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {text ? `${text.split(/\s+/).filter(Boolean).length} words` : ''}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setText('')} disabled={!text}>
            Clear
          </Button>
          <Button size="sm" onClick={handleLoad} disabled={!text.trim()}>
            Load & Skim
          </Button>
        </div>
      </div>
    </div>
  );
}
