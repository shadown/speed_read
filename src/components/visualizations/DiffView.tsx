import { useState, memo } from 'react';
import type { DiffData, DiffFile } from '@/types';
import { HEATMAP_COLORS } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, FilePlus, FileMinus, FileEdit } from 'lucide-react';

interface DiffViewProps {
  diffData: DiffData;
}

/**
 * DiffView — Production-quality side-by-side diff viewer.
 * Features: collapsible files, expandable hunks, semantic cluster badges,
 * file status indicators, and change counts.
 */
export const DiffView = memo(function DiffView({ diffData }: DiffViewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    () => new Set(diffData.files.map((f) => f.fileName)),
  );
  const [expandedHunks, setExpandedHunks] = useState<Set<string>>(new Set());

  const toggleFile = (name: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleHunk = (id: string) => {
    setExpandedHunks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (diffData.files.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground/60">
        No changes parsed from this diff.
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-slide-up">
      {diffData.files.map((file) => (
        <FileBlock
          key={file.fileName}
          file={file}
          cluster={diffData.clusters[file.clusterIndex]}
          isExpanded={expandedFiles.has(file.fileName)}
          onToggle={() => toggleFile(file.fileName)}
          expandedHunks={expandedHunks}
          onToggleHunk={toggleHunk}
        />
      ))}
    </div>
  );
});

/* ─── File Block ──────────────────────────────────────────────────────────── */
function FileBlock({
  file,
  cluster,
  isExpanded,
  onToggle,
  expandedHunks,
  onToggleHunk,
}: {
  file: DiffFile;
  cluster: { label: string; category: string } | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  expandedHunks: Set<string>;
  onToggleHunk: (id: string) => void;
}) {
  const StatusIcon = file.status === 'added' ? FilePlus
    : file.status === 'deleted' ? FileMinus
    : FileEdit;
  const statusColor = file.status === 'added' ? 'text-green-500'
    : file.status === 'deleted' ? 'text-red-500'
    : 'text-blue-500';

  return (
    <div className="rounded-lg border overflow-hidden transition-shadow duration-200 hover:shadow-sm">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-accent/30 transition-colors"
      >
        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
        <StatusIcon className={cn('h-4 w-4 shrink-0', statusColor)} />
        <span className="flex-1 truncate font-mono text-xs">{file.filePath}</span>
        {cluster && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: (HEATMAP_COLORS as any)[cluster.category] + '14',
              color: (HEATMAP_COLORS as any)[cluster.category],
            }}
          >
            {cluster.label}
          </span>
        )}
        <span className="text-xs font-mono tabular-nums">
          <span className="text-green-500">+{file.additions}</span>
          <span className="text-muted-foreground mx-0.5">/</span>
          <span className="text-red-500">-{file.deletions}</span>
        </span>
      </button>

      {/* Hunks */}
      {isExpanded && (
        <div className="border-t divide-y">
          {file.hunks.map((hunk, hi) => {
            const hunkId = `${file.fileName}/h${hi}`;
            const open = expandedHunks.has(hunkId) || hi < 3;
            const lines = hunk.lines.length > 60 && !open ? hunk.lines.slice(0, 60) : hunk.lines;

            return (
              <div key={hunkId}>
                <button
                  onClick={() => onToggleHunk(hunkId)}
                  className="flex items-center gap-2 w-full px-4 py-1 text-[11px] font-mono text-muted-foreground hover:bg-accent/30 transition-colors"
                >
                  {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <span className="opacity-60 select-none">@@</span>
                  <span>-{hunk.oldStart},{hunk.oldLines}</span>
                  <span className="opacity-60 select-none">→</span>
                  <span>+{hunk.newStart},{hunk.newLines}</span>
                  {hunk.lines.length > 60 && !open && (
                    <span className="text-[10px] opacity-60 ml-auto">{hunk.lines.length} lines</span>
                  )}
                </button>

                {open && (
                  <div className="font-mono text-[12px] leading-[1.7] overflow-x-auto border-t">
                    <div className="grid grid-cols-2 divide-x">
                      <div>
                        {lines.map((line, li) => (
                          <div
                            key={`o-${li}`}
                            className={cn(
                              'flex',
                              line.type === 'removed' && 'bg-red-500/8 text-red-600 dark:text-red-400',
                              line.type === 'added' && 'bg-muted/30',
                            )}
                          >
                            <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-muted-foreground/40 select-none tabular-nums">
                              {line.type !== 'added' ? hunk.oldStart + li : ''}
                            </span>
                            <span className="w-3 shrink-0 text-center text-[10px] text-muted-foreground/40 select-none">
                              {line.type === 'removed' ? '−' : ''}
                            </span>
                            <span className="flex-1 px-1 truncate">{line.content}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        {lines.map((line, li) => (
                          <div
                            key={`n-${li}`}
                            className={cn(
                              'flex',
                              line.type === 'added' && 'bg-green-500/8 text-green-600 dark:text-green-400',
                              line.type === 'removed' && 'bg-muted/30',
                            )}
                          >
                            <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-muted-foreground/40 select-none tabular-nums">
                              {line.type !== 'removed' ? hunk.newStart + li : ''}
                            </span>
                            <span className="w-3 shrink-0 text-center text-[10px] text-muted-foreground/40 select-none">
                              {line.type === 'added' ? '+' : ''}
                            </span>
                            <span className="flex-1 px-1 truncate">{line.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
