// ============================================================================
// ReadForge — Core Type Definitions
// ============================================================================

// ─── Reading Modes ───────────────────────────────────────────────────────────
export type ReaderMode = 'input' | 'skim' | 'guided' | 'deep';

export type ChunkSize = 'word' | '3word' | 'phrase' | 'sentence';

// ─── Text Processing ─────────────────────────────────────────────────────────
export interface TextChunk {
  id: string;
  text: string;
  index: number;
  paragraphIndex: number;
  wordCount: number;
  words: string[];
  startChar: number;
  endChar: number;
}

export interface Paragraph {
  id: string;
  text: string;
  index: number;
  charStart: number;
  charEnd: number;
  category: HeatmapCategory;
  aiImpact: number; // 0–1
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
export type HeatmapCategory =
  | 'logic'
  | 'ui'
  | 'tests'
  | 'security'
  | 'performance'
  | 'docs'
  | 'config'
  | 'other';

export interface HeatmapItem {
  paragraphIndex: number;
  category: HeatmapCategory;
  confidence: number; // 0–1
  reasoning: string;
}

export const HEATMAP_COLORS: Record<HeatmapCategory, string> = {
  logic: '#ef4444',
  ui: '#3b82f6',
  tests: '#22c55e',
  security: '#f59e0b',
  performance: '#a855f7',
  docs: '#06b6d4',
  config: '#78716c',
  other: '#6b7280',
};

export const HEATMAP_COLORS_LIGHT: Record<HeatmapCategory, string> = {
  logic: '#dc2626',
  ui: '#2563eb',
  tests: '#16a34a',
  security: '#d97706',
  performance: '#9333ea',
  docs: '#0891b2',
  config: '#57534e',
  other: '#4b5563',
};

export const HEATMAP_LABELS: Record<HeatmapCategory, string> = {
  logic: 'Logic / Algorithm',
  ui: 'UI / Frontend',
  tests: 'Tests',
  security: 'Security',
  performance: 'Performance',
  docs: 'Documentation',
  config: 'Configuration',
  other: 'Other',
};

// ─── Diff Data ───────────────────────────────────────────────────────────────
export interface DiffData {
  files: DiffFile[];
  totalAdditions: number;
  totalDeletions: number;
  clusters: SemanticCluster[];
}

export type DiffFileStatus = 'added' | 'modified' | 'deleted';

export interface DiffFile {
  fileName: string;
  filePath: string;
  status: DiffFileStatus;
  hunks: Hunk[];
  additions: number;
  deletions: number;
  clusterIndex: number;
}

export interface Hunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: HunkLine[];
}

export interface HunkLine {
  type: 'added' | 'removed' | 'context';
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
}

export interface SemanticCluster {
  id: string;
  label: string;
  category: HeatmapCategory;
  fileIndices: number[];
  changeCount: number;
  additions: number;
  deletions: number;
  severity: number; // 0–1
}

// ─── AI / Clusters ───────────────────────────────────────────────────────────
export interface AiCluster {
  id: string;
  label: string;
  description: string;
  items: string[];
  color: string;
}

export interface ClusterRelation {
  fromId: string;
  toId: string;
  label: string;
  type: 'supports' | 'contradicts' | 'leads-to' | 'part-of' | 'related';
}

// ─── Settings ────────────────────────────────────────────────────────────────
export type DeepSeekModel = 'deepseek-chat' | 'deepseek-reasoner';

// ─── AI Analysis Types ───────────────────────────────────────────────────────
export interface AiAnalysisResult {
  summary: string;
  heatmap: HeatmapItem[];
  clusters: AiCluster[];
  relations: ClusterRelation[];
  confidence: number;
  processingTime: number;
}

// ─── File Metadata ───────────────────────────────────────────────────────────
export interface FileMeta {
  name: string;
  type: 'text' | 'markdown' | 'diff' | 'pdf';
  size: number;
  wordCount: number;
  lineCount: number;
}

// ─── Progress ────────────────────────────────────────────────────────────────
export interface ReadingProgress {
  chunksTotal: number;
  chunksRead: number;
  percentComplete: number;
  estimatedSecondsRemaining: number;
  effectiveWpm: number;
}
