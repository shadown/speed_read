import { create } from 'zustand';
import { DeepSeekService } from '@/services/DeepSeekService';
import { useSettingsStore } from './settingsStore';
import { useDocumentStore } from './documentStore';
import { SUMMARIZE_SYSTEM_PROMPT } from '@/prompts/summarize';
import { HEATMAP_SYSTEM_PROMPT } from '@/prompts/heatmap';
import { CLUSTER_SYSTEM_PROMPT } from '@/prompts/cluster';
import { DIFF_SYSTEM_PROMPT } from '@/prompts/diff';
import type { HeatmapItem, AiCluster, ClusterRelation, ReaderMode } from '@/types';

/**
 * Try to extract a JSON block from AI responses.
 * Supports fenced code blocks (```json) or extracts between first '{' and last '}'.
 */
function extractJsonBlock(text: string): string | null {
  const fence = /```(?:json)?\s*([\s\S]*?)```/i;
  const m = text.match(fence);
  if (m && m[1]) return m[1].trim();

  // Try array first, then object — pick whichever starts earlier
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');

  const hasObject = firstBrace !== -1 && lastBrace > firstBrace;
  const hasArray = firstBracket !== -1 && lastBracket > firstBracket;

  if (hasArray && (!hasObject || firstBracket < firstBrace)) {
    return text.slice(firstBracket, lastBracket + 1);
  }
  if (hasObject) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

interface AiStore {
  isProcessing: boolean;
  streamingText: string;
  error: string | null;

  // Actions
  startAnalysis: (text: string, mode: ReaderMode) => Promise<void>;
  startSkimAnalysis: (text: string) => Promise<void>;
  startDiffAnalysis: (text: string) => Promise<void>;
  cancelAnalysis: () => void;
  testApiKey: (key: string) => Promise<boolean>;
  reset: () => void;
}

let currentService: DeepSeekService | null = null;

export const useAiStore = create<AiStore>((set, get) => ({
  isProcessing: false,
  streamingText: '',
  error: null,

  startAnalysis: async (text: string, mode: ReaderMode) => {
    if (mode === 'skim') {
      await get().startSkimAnalysis(text);
    } else if (mode === 'deep') {
      await get().startDiffAnalysis(text);
    }
  },

  startSkimAnalysis: async (text: string) => {
    const settings = useSettingsStore.getState();
    if (!settings.apiKey) {
      set({ error: 'No API key configured. Add one in Settings.' });
      return;
    }
    if (get().isProcessing) return;

    set({ isProcessing: true, streamingText: '', error: null });
    const service = new DeepSeekService();
    currentService = service;

    const docStore = useDocumentStore.getState();

    try {
      // Step 1: Summarization
      await service.streamChat(
        {
          systemPrompt: SUMMARIZE_SYSTEM_PROMPT,
          userMessage: text.slice(0, 30000), // Truncate to 30K chars for API
          model: settings.model,
          apiKey: settings.apiKey,
        },
        {
          onChunk: (chunk) => {
            set(state => ({ streamingText: state.streamingText + chunk }));
          },
          onComplete: (fullText) => {
            if (fullText) {
              // Try to parse JSON response
              try {
                const parsed = JSON.parse(fullText);
                docStore.setAiSummary(parsed.oneLineSummary || parsed.title || fullText, fullText);
                docStore.setAiConfidence(parsed.confidence ?? 0.7);
              } catch {
                docStore.setAiSummary(fullText, fullText);
                docStore.setAiConfidence(0.5);
              }
            }
          },
          onError: (err) => {
            set({ error: `Summarization failed: ${err.message}` });
          },
        },
      );

      if (get().error) return;

      // Step 2: Heatmap analysis
      set({ streamingText: '' });
      const heatmapService = new DeepSeekService();
      currentService = heatmapService;

      const paragraphTexts = docStore.paragraphs.map(p => `[${p.index}] ${p.text}`).join('\n\n');

      await heatmapService.streamChat(
        {
          systemPrompt: HEATMAP_SYSTEM_PROMPT,
          userMessage: paragraphTexts.slice(0, 25000),
          model: settings.model,
          apiKey: settings.apiKey,
        },
        {
          onChunk: () => {}, // Don't stream heatmap result to UI
          onComplete: (fullText) => {
            if (fullText) {
              try {
                const jsonText = extractJsonBlock(fullText) ?? fullText;
                const parsed = JSON.parse(jsonText);
                if (Array.isArray(parsed)) {
                  docStore.setAiHeatmap(parsed as HeatmapItem[]);
                }
              } catch (err) {
                console.warn('Failed to parse heatmap JSON response', err, fullText.slice(0,200));
              }
            }
          },
          onError: (err) => {
            console.warn('Heatmap analysis error:', err.message);
          },
        },
      );

      // Step 3: Concept clustering
      set({ streamingText: '' });
      const clusterService = new DeepSeekService();
      currentService = clusterService;

      await clusterService.streamChat(
        {
          systemPrompt: CLUSTER_SYSTEM_PROMPT,
          userMessage: text.slice(0, 20000),
          model: settings.model,
          apiKey: settings.apiKey,
        },
        {
          onChunk: () => {},
          onComplete: (fullText) => {
            if (fullText) {
              try {
                const jsonText = extractJsonBlock(fullText) ?? fullText;
                const parsed = JSON.parse(jsonText);
                docStore.setAiClusters(
                  (parsed.clusters || []) as AiCluster[],
                  (parsed.relations || []) as ClusterRelation[],
                );
              } catch (err) {
                console.warn('Failed to parse cluster JSON response', err, fullText.slice(0,200));
              }
            }
          },
          onError: (err) => {
            console.warn('Cluster analysis error:', err.message);
          },
        },
      );
    } finally {
      set({ isProcessing: false, streamingText: '' });
      currentService = null;
    }
  },

  startDiffAnalysis: async (text: string) => {
    const settings = useSettingsStore.getState();
    if (!settings.apiKey) {
      set({ error: 'No API key configured. Add one in Settings.' });
      return;
    }
    if (get().isProcessing) return;

    set({ isProcessing: true, streamingText: '', error: null });
    const service = new DeepSeekService();
    currentService = service;

    const docStore = useDocumentStore.getState();

    try {
      await service.streamChat(
        {
          systemPrompt: DIFF_SYSTEM_PROMPT,
          userMessage: text.slice(0, 40000),
          model: settings.model,
          apiKey: settings.apiKey,
        },
        {
          onChunk: (chunk) => {
            set(state => ({ streamingText: state.streamingText + chunk }));
          },
          onComplete: (fullText) => {
            if (fullText) {
              try {
                const parsed = JSON.parse(fullText);
                docStore.setAiSummary(parsed.overallAssessment || parsed.impactSummary || fullText, fullText);
                docStore.setAiConfidence(parsed.riskLevel === 'high' ? 0.9 : parsed.riskLevel === 'medium' ? 0.7 : 0.5);
              } catch {
                docStore.setAiSummary(fullText, fullText);
                docStore.setAiConfidence(0.5);
              }
            }
          },
          onError: (err) => {
            set({ error: `Diff analysis failed: ${err.message}` });
          },
        },
      );
    } finally {
      set({ isProcessing: false, streamingText: '' });
      currentService = null;
    }
  },

  cancelAnalysis: () => {
    currentService?.cancel();
    currentService = null;
    set({ isProcessing: false, streamingText: '' });
  },

  testApiKey: async (key: string): Promise<boolean> => {
    return DeepSeekService.testConnection(key);
  },

  reset: () => {
    get().cancelAnalysis();
    set({ streamingText: '', error: null });
  },
}));
