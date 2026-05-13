import * as Diff from 'diff';
import type { DiffData, DiffFile, Hunk, HunkLine, SemanticCluster, HeatmapCategory } from '@/types';
import { uid, fileNameFromPath } from '@/utils';

/**
 * DiffParser — Parses unified diff text into structured data with semantic clustering.
 */
export class DiffParser {
  /**
   * Parse unified diff string
   */
  static parse(diffText: string): DiffData {
    // Use the 'diff' library to parse
    const parsedFiles = Diff.parsePatch(diffText);

    const files: DiffFile[] = parsedFiles.map((file: any) => {
      const fileName = file.newFileName?.replace(/^b\//, '') || 
                       file.oldFileName?.replace(/^a\//, '') || 
                       'unknown';

      const hunks: Hunk[] = (file.hunks || []).map((hunk: any) => ({
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart,
        newLines: hunk.newLines,
        lines: (hunk.lines || []).map((line: string): HunkLine => {
          const type = line.startsWith('+') ? 'added' as const :
                       line.startsWith('-') ? 'removed' as const :
                       'context' as const;
          return {
            type,
            content: line.slice(1),
            oldLineNumber: null, // computed below if needed
            newLineNumber: null,
          };
        }),
      }));

      const additions = hunks.reduce((a: number, h: Hunk) => 
        a + h.lines.filter(l => l.type === 'added').length, 0);
      const deletions = hunks.reduce((a: number, h: Hunk) => 
        a + h.lines.filter(l => l.type === 'removed').length, 0);

      return {
        fileName: fileNameFromPath(fileName),
        filePath: fileName,
        status: file.newFileName && !file.oldFileName ? 'added' :
                !file.newFileName && file.oldFileName ? 'deleted' :
                'modified',
        hunks,
        additions,
        deletions,
        clusterIndex: 0, // assigned below
      };
    });

    const totalAdditions = files.reduce((a, f) => a + f.additions, 0);
    const totalDeletions = files.reduce((a, f) => a + f.deletions, 0);

    // Semantic clustering based on file path patterns
    const clusters = DiffParser.clusterFiles(files);

    // Assign cluster indices to files
    for (const file of files) {
      const matchIdx = clusters.findIndex(c => c.fileIndices.includes(files.indexOf(file)));
      file.clusterIndex = matchIdx >= 0 ? matchIdx : 0;
    }

    return { files, totalAdditions, totalDeletions, clusters };
  }

  /**
   * Cluster files by semantic category based on file path patterns
   */
  static clusterFiles(files: DiffFile[]): SemanticCluster[] {
    const clusterMap = new Map<string, { indices: number[]; additions: number; deletions: number }>();

    const categoryPatterns: Array<{ pattern: RegExp; label: string; category: HeatmapCategory }> = [
      { pattern: /\b(test|spec|__tests__|jest|vitest|cypress|e2e)\b/i, label: 'Tests', category: 'tests' },
      { pattern: /\b(ui|component|view|page|layout|style|css|scss|tailwind)\b/i, label: 'UI / Components', category: 'ui' },
      { pattern: /\b(security|auth|login|permission|role|session|token)\b/i, label: 'Security / Auth', category: 'security' },
      { pattern: /\b(config|conf|env|setup|docker|ci|cd|yml|yaml|json|toml)\b/i, label: 'Configuration', category: 'config' },
      { pattern: /\b(doc|readme|md|guide|manual|comment)\b/i, label: 'Documentation', category: 'docs' },
      { pattern: /\b(perf|performance|optimize|benchmark|latency|memory)\b/i, label: 'Performance', category: 'performance' },
      { pattern: /\b(service|api|route|middleware|controller|handler|logic|util|helper)\b/i, label: 'Logic / API', category: 'logic' },
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let assigned = false;

      for (const { pattern, label, category } of categoryPatterns) {
        if (pattern.test(file.filePath)) {
          const key = `${category}:${label}`;
          const existing = clusterMap.get(key) || { indices: [], additions: 0, deletions: 0 };
          existing.indices.push(i);
          existing.additions += file.additions;
          existing.deletions += file.deletions;
          clusterMap.set(key, existing);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        const key = 'other:Other';
        const existing = clusterMap.get(key) || { indices: [], additions: 0, deletions: 0 };
        existing.indices.push(i);
        existing.additions += file.additions;
        existing.deletions += file.deletions;
        clusterMap.set(key, existing);
      }
    }

    return Array.from(clusterMap.entries()).map(([key, data]) => {
      const [category, label] = key.split(':');
      const changeCount = data.additions + data.deletions;
      const maxChanges = Math.max(...Array.from(clusterMap.values()).map(v => v.additions + v.deletions), 1);
      return {
        id: uid(),
        label,
        category: category as HeatmapCategory,
        fileIndices: data.indices,
        changeCount,
        additions: data.additions,
        deletions: data.deletions,
        severity: changeCount / maxChanges,
      };
    }).sort((a, b) => b.changeCount - a.changeCount);
  }
}
