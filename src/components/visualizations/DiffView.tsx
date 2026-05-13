import { useState } from 'react';
import type { DiffData, DiffFile } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, FilePlus, FileMinus, FileEdit } from 'lucide-react';
import { HEATMAP_COLORS } from '@/types';

interface DiffViewProps {
  diffData: DiffData;
}

/**
 * DiffView — Side-by-side code diff visualization
 */
export function DiffView({ diffData }: DiffViewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set(diffData.files.map(f => f.fileName)));
  const [expandedHunks, setExpandedHunks] = useState<Set<string>>(new Set());

  const toggleFile = (fileName: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileName)) next.delete(fileName);
      else next.add(fileName);
      return next;
    });
  };

  const toggleHunk = (hunkId: string) => {
    setExpandedHunks(prev => {
      const next = new Set(prev);
      if (next.has(hunkId)) next.delete(hunkId);
      else next.add(hunkId);
      return next;
    });
  };

  const getFileIcon = (file: DiffFile) => {
    switch (file.status) {
      case 'added': return <FilePlus className="h-4 w-4 text-green-500" />;
      case 'deleted': return <FileMinus className="h-4 w-4 text-red-500" />;
      default: return <FileEdit className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (file: DiffFile) => {
    switch (file.status) {
      case 'added': return <span className="text-[10px] px-1 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">ADDED</span>;
      case 'deleted': return <span className="text-[10px] px-1 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">DELETED</span>;
      default: return <span className="text-[10px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium">MODIFIED</span>;
    }
  };

  return (
    <div className="space-y-3">
      {diffData.files.map((file) => {
        const isExpanded = expandedFiles.has(file.fileName);
        const cluster = diffData.clusters[file.clusterIndex];

        return (
          <div key={file.fileName} className="rounded-lg border overflow-hidden">
            {/* File header */}
            <button
              onClick={() => toggleFile(file.fileName)}
              className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm font-medium hover:bg-accent transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {getFileIcon(file)}
              <span className="flex-1 truncate">{file.filePath}</span>
              {getStatusBadge(file)}
              {cluster && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: HEATMAP_COLORS[cluster.category] + '20',
                    color: HEATMAP_COLORS[cluster.category],
                  }}
                >
                  {cluster.label}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                <span className="text-green-500">+{file.additions}</span>{' '}
                <span className="text-red-500">-{file.deletions}</span>
              </span>
            </button>

            {/* Hunks */}
            {isExpanded && (
              <div className="border-t">
                {file.hunks.map((hunk, hi) => {
                  const hunkId = `${file.fileName}-hunk-${hi}`;
                  const isHunkExpanded = expandedHunks.has(hunkId) || hi < 3; // Auto-expand first 3

                  return (
                    <div key={hunkId}>
                      <button
                        onClick={() => toggleHunk(hunkId)}
                        className="flex items-center gap-2 w-full px-3 py-1 text-[10px] font-mono text-muted-foreground hover:bg-accent/50 border-t"
                      >
                        {isHunkExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
                      </button>

                      {isHunkExpanded && (
                        <div className="font-mono text-[11px] leading-[1.6] overflow-x-auto">
                          {/* Side-by-side layout */}
                          <div className="grid grid-cols-2 divide-x">
                            {/* Old (left) */}
                            <div>
                              {hunk.lines.map((line, li) => (
                                <div
                                  key={`old-${li}`}
                                  className={`flex ${
                                    line.type === 'removed' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                    line.type === 'added' ? 'bg-muted/30' : ''
                                  }`}
                                >
                                  <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-muted-foreground select-none">
                                    {line.type !== 'added' ? hunk.oldStart + li : ''}
                                  </span>
                                  <span className="w-4 shrink-0 text-center text-[10px] text-muted-foreground select-none">
                                    {line.type === 'removed' ? '-' : ''}
                                  </span>
                                  <span className="flex-1 px-1 truncate">{line.content}</span>
                                </div>
                              ))}
                            </div>
                            {/* New (right) */}
                            <div>
                              {hunk.lines.map((line, li) => (
                                <div
                                  key={`new-${li}`}
                                  className={`flex ${
                                    line.type === 'added' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : ''
                                  } ${line.type === 'removed' ? 'bg-muted/30' : ''}`}
                                >
                                  <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-muted-foreground select-none">
                                    {line.type !== 'removed' ? hunk.newStart + li : ''}
                                  </span>
                                  <span className="w-4 shrink-0 text-center text-[10px] text-muted-foreground select-none">
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
      })}

      {diffData.files.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          No files parsed from this diff.
        </div>
      )}
    </div>
  );
}
