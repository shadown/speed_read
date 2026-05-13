import { useRef, useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { cn } from '@/lib/utils';
import { Upload, FileText, FileDiff, File as FileIcon } from 'lucide-react';

const ACCEPTED = '.md,.txt,.pdf,.diff,.patch';

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const setDocFile = useDocumentStore((s) => s.setFile);
  const setMode = useReaderStore((s) => s.setMode);

  const handleFile = async (f: File) => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return;
    setFile(f);
    await setDocFile(f);
    setMode('skim');
  };

  const FileIconComponent = file?.name.endsWith('.diff') || file?.name.endsWith('.patch')
    ? FileDiff : file?.name.endsWith('.pdf') ? FileIcon : FileText;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Upload file</label>
        <span className="text-[11px] text-muted-foreground/60">.md .txt .pdf .diff .patch</span>
      </div>

      <div
        className={cn(
          'relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          dragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-input hover:border-muted-foreground/40 hover:bg-accent/20',
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileIconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium">{file.name}</div>
            <div className="text-[11px] text-muted-foreground/60 tabular-nums">
              {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <Upload className="h-7 w-7" />
            <span className="text-sm">Drop a file here, or click to browse</span>
            <span className="text-[10px]">Markdown, text, PDF, or unified diffs</span>
          </div>
        )}
      </div>
    </div>
  );
}
