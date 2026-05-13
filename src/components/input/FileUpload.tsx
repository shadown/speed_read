import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { Upload, FileText, FileDiff, File as FileIcon } from 'lucide-react';

const ACCEPTED_TYPES = ['.md', '.txt', '.pdf', '.diff', '.patch'];

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const setFile = useDocumentStore(s => s.setFile);
  const setMode = useReaderStore(s => s.setMode);

  const handleFile = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      alert(`Unsupported file type: ${ext}. Accepted: ${ACCEPTED_TYPES.join(', ')}`);
      return;
    }
    setUploadedFile(file);
    await setFile(file);
    setMode('skim');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Upload a file</label>
        <span className="text-xs text-muted-foreground">
          .md .txt .pdf .diff .patch
        </span>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center h-36 rounded-md border-2 border-dashed transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-input hover:border-muted-foreground'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {uploadedFile ? (
          <div className="flex items-center gap-2 text-sm">
            {uploadedFile.name.endsWith('.diff') || uploadedFile.name.endsWith('.patch')
              ? <FileDiff className="h-5 w-5 text-primary" />
              : uploadedFile.name.endsWith('.pdf')
                ? <FileIcon className="h-5 w-5 text-primary" />
                : <FileText className="h-5 w-5 text-primary" />
            }
            <span className="font-medium">{uploadedFile.name}</span>
            <span className="text-muted-foreground">
              ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Upload className="h-6 w-6" />
            <span className="text-sm">Drop a file here or click to browse</span>
          </div>
        )}
      </div>
    </div>
  );
}
