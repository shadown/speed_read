import { create } from 'zustand';
import type {
  TextChunk, Paragraph, HeatmapItem, AiCluster, ClusterRelation,
  DiffData, FileMeta, HeatmapCategory,
} from '@/types';
import { ChunkingService } from '@/services/ChunkingService';
import { TextParser } from '@/services/TextParser';
import { DiffParser } from '@/services/DiffParser';
import { countWords, countLines, uid } from '@/utils';

interface DocumentStore {
  // Raw data
  rawText: string;
  fileName: string | null;
  fileType: FileMeta['type'] | null;
  fileMeta: FileMeta | null;

  // Processed data
  paragraphs: Paragraph[];
  chunks: TextChunk[];
  diffData: DiffData | null;

  // AI results
  aiSummary: string | null;
  aiSummaryRaw: string | null;  // raw JSON before parsing
  aiHeatmap: HeatmapItem[] | null;
  aiClusters: AiCluster[] | null;
  aiClusterRelations: ClusterRelation[] | null;
  aiConfidence: number;

  // Actions
  setRawText: (text: string) => void;
  setFile: (file: File) => Promise<void>;
  setFileName: (name: string, type: FileMeta['type']) => void;
  processText: () => void;
  setAiSummary: (summary: string, raw?: string) => void;
  setAiHeatmap: (heatmap: HeatmapItem[]) => void;
  setAiClusters: (clusters: AiCluster[], relations: ClusterRelation[]) => void;
  setAiConfidence: (confidence: number) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  rawText: '',
  fileName: null,
  fileType: null,
  fileMeta: null,
  paragraphs: [],
  chunks: [],
  diffData: null,
  aiSummary: null,
  aiSummaryRaw: null,
  aiHeatmap: null,
  aiClusters: null,
  aiClusterRelations: null,
  aiConfidence: 0,

  setRawText: (text: string) => {
    const normalized = TextParser.normalizeText(text);
    const type = TextParser.detectType(normalized);
    set({
      rawText: normalized,
      fileType: type,
      fileMeta: {
        name: 'Pasted Text',
        type,
        size: normalized.length,
        wordCount: countWords(normalized),
        lineCount: countLines(normalized),
      },
    });
    get().processText();
  },

  setFile: async (file: File) => {
    const { text, meta } = await TextParser.parseFile(file);
    const normalized = TextParser.normalizeText(text);
    set({
      rawText: normalized,
      fileName: file.name,
      fileType: meta.type,
      fileMeta: meta,
    });
    get().processText();
  },

  setFileName: (name: string, type: FileMeta['type']) => {
    set({ fileName: name, fileType: type });
  },

  processText: () => {
    const { rawText, fileType } = get();
    if (!rawText) {
      set({ paragraphs: [], chunks: [], diffData: null });
      return;
    }

    let diffData: DiffData | null = null;

    if (fileType === 'diff') {
      try {
        diffData = DiffParser.parse(rawText);
      } catch (err) {
        console.error('Diff parsing failed:', err);
      }
    }

    // Build paragraphs
    const paragraphTexts = ChunkingService.splitParagraphs(rawText);
    const paragraphs: Paragraph[] = paragraphTexts.map((text, index) => ({
      id: uid(),
      text,
      index,
      charStart: 0, // approximate; recomputed if needed
      charEnd: text.length,
      category: 'other' as HeatmapCategory,
      aiImpact: 0.5,
    }));

    // Build chunks
    const chunks = ChunkingService.chunkText(rawText, '3word');

    set({ paragraphs, chunks, diffData });
  },

  setAiSummary: (summary: string, raw?: string) => {
    set({ aiSummary: summary, aiSummaryRaw: raw ?? summary });
  },

  setAiHeatmap: (heatmap: HeatmapItem[]) => {
    set({ aiHeatmap: heatmap });

    // Update paragraph categories based on heatmap
    const paragraphs = get().paragraphs.map(p => {
      const hm = heatmap.find(h => h.paragraphIndex === p.index);
      if (hm) {
        return { ...p, category: hm.category, aiImpact: hm.confidence };
      }
      return p;
    });
    set({ paragraphs });
  },

  setAiClusters: (clusters: AiCluster[], relations: ClusterRelation[]) => {
    set({ aiClusters: clusters, aiClusterRelations: relations });
  },

  setAiConfidence: (confidence: number) => {
    set({ aiConfidence: confidence });
  },

  reset: () => {
    set({
      rawText: '',
      fileName: null,
      fileType: null,
      fileMeta: null,
      paragraphs: [],
      chunks: [],
      diffData: null,
      aiSummary: null,
      aiSummaryRaw: null,
      aiHeatmap: null,
      aiClusters: null,
      aiClusterRelations: null,
      aiConfidence: 0,
    });
  },
}));
